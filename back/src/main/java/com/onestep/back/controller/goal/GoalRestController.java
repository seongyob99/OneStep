package com.onestep.back.controller.goal;

import com.onestep.back.dto.goal.GoalDTO;
import com.onestep.back.service.goal.GoalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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

    // ✅ 목표 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<GoalDTO>> getGoalList(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String title) {

        List<GoalDTO> goals = goalService.getList(categoryId, title);
        return ResponseEntity.ok(goals);
    }

    // ✅ 목표 등록 (로그인 사용자 기반)
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerGoal(
            @ModelAttribute GoalDTO goalDTO,
            @RequestParam("categoryId") Long categoryId,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {  // ✅ 로그인된 사용자 정보 가져오기

        // ✅ 로그인한 사용자만 등록 가능
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "로그인이 필요합니다."));
        }

        String memberId = userDetails.getUsername(); // 로그인된 사용자 ID
        goalDTO.setMemberId(memberId);
        goalDTO.setCategoryId(categoryId);

        try {
            // ✅ 파일 업로드 처리
            if (file != null && !file.isEmpty()) {
                String uuid = UUID.randomUUID().toString();
                String fileName = uuid + "_" + file.getOriginalFilename();
                Path savePath = Paths.get(uploadPath, fileName);

                Path uploadDir = Paths.get(uploadPath);
                if (Files.notExists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                file.transferTo(savePath);
                goalDTO.setThumbnail(fileName);
            } else {
                log.info("📂 파일이 제공되지 않음. 기본값 유지");
            }

            // ✅ 목표 데이터베이스 저장
            Long goalId = goalService.register(goalDTO);

            // ✅ 응답 데이터 반환
            return ResponseEntity.ok(Map.of("goalId", goalId));

        } catch (IOException e) {
            log.error("파일 업로드 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "파일 업로드 중 오류가 발생했습니다."));
        } catch (Exception e) {
            log.error("목표 등록 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "목표 등록 중 오류가 발생했습니다."));
        }
    }
}
