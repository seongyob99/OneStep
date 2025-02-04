package com.onestep.back.controller.goal;

import com.onestep.back.dto.goal.GoalDTO;
import com.onestep.back.service.goal.GoalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor
public class GoalRestController {

    @Value("${com.onestep.upload.path}") // 파일 업로드 경로
    private String uploadPath;

    private final GoalService goalService;

    // 목표 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<GoalDTO>> getGoalList(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String title) {

        log.info("📌 목표 목록 조회 요청: categoryId={}, title={}", categoryId, title);
        List<GoalDTO> goals = goalService.getList(categoryId, title);
        return ResponseEntity.ok(goals);
    }

    // 목표 등록
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerGoal(
            @ModelAttribute GoalDTO goalDTO,
            @RequestParam("memberId") String memberId,
            @RequestParam("categoryId") Long categoryId,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        // ✅ 로그인 구현 전까지 기본 `memberId` 하드코딩
        if (memberId == null || memberId.trim().isEmpty()) {
            memberId = "user01";  // ✅ 여기에 하드코딩
        }

        log.info("✅ 현재 로그인된 사용자 ID: {}", memberId);

        log.info("✅ 목표 등록 요청: {}", goalDTO);
        goalDTO.setMemberId(memberId);
        goalDTO.setCategoryId(categoryId);

        try {
            // 파일 업로드 처리
            if (file != null && !file.isEmpty()) {
                log.info("📂 파일 업로드 시작: {}", file.getOriginalFilename());

                String uuid = UUID.randomUUID().toString();
                String fileName = uuid + "_" + file.getOriginalFilename();
                Path savePath = Paths.get(uploadPath, fileName);

                log.info("📂 파일 저장 경로: {}", savePath);

                Path uploadDir = Paths.get(uploadPath);
                if (Files.notExists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                    log.info("📂 업로드 경로 생성 완료: {}", uploadDir);
                }

                file.transferTo(savePath);
                log.info("✅ 파일 저장 완료: {}", savePath);

                goalDTO.setThumbnail(fileName);
            } else {
                log.info("📂 파일이 제공되지 않음. 기본값 유지");
            }

            // 목표 데이터베이스 저장 (goals, goals_members, chats, chats_members 자동 추가)
            Long goalId = goalService.register(goalDTO);
            log.info("✅ 목표 등록 완료: ID={}", goalId);

            // 응답 데이터 생성
            Map<String, Object> response = new HashMap<>();
            response.put("goalId", goalId);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("❌ 파일 업로드 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "파일 업로드 중 오류가 발생했습니다."));
        } catch (Exception e) {
            log.error("❌ 목표 등록 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "목표 등록 중 오류가 발생했습니다."));
        }
    }
}
