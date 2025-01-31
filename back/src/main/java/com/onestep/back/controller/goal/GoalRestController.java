package com.onestep.back.controller.goal;

import com.onestep.back.dto.GoalDTO;
import com.onestep.back.service.goal.GoalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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

    // 목표 목록 조회
    @GetMapping("/list")
    public Page<GoalDTO> getPagedGoalList(
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("📌 목표 목록 조회 요청: categoryName={}, title={}, page={}, size={}", categoryName, title, page, size);

        Pageable pageable = PageRequest.of(page, size);
        return goalService.getPagedList(categoryName, title, pageable);
    }


    // 목표 등록
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerGoal(
            @ModelAttribute GoalDTO goalDTO,
            @RequestParam("memberId") String memberId,
            @RequestParam("categoryId") Long categoryId,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        // 로그인된 사용자 ID 가져오기 (로그인 연동 후 사용)
    /*
    String memberId = null;
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof UserDetails) {
        memberId = ((UserDetails) principal).getUsername(); // 로그인 사용자 ID
    }
    */

        log.info("✅ 현재 로그인된 사용자 ID: {}", memberId);
        log.info("📌 목표 등록 요청: {}", goalDTO);
        log.info("📌 memberId: {}", memberId);
        log.info("📌 categoryId: {}", categoryId);

        // memberId와 categoryId 설정
        goalDTO.setMemberId(memberId);
        goalDTO.setCategoryId(categoryId);

        try {
            // 🛠 파일 업로드 처리
            if (file != null && !file.isEmpty()) {
                log.info("📂 파일 업로드 시작: {}", file.getOriginalFilename());

                // 파일명 생성
                String uuid = UUID.randomUUID().toString();
                String fileName = uuid + "_" + file.getOriginalFilename();
                Path savePath = Paths.get(uploadPath, fileName);

                log.info("📂 파일 저장 경로: {}", savePath);

                // 🛠 업로드 경로가 존재하지 않으면 생성
                Path uploadDir = Paths.get(uploadPath);
                if (Files.notExists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                    log.info("📂 업로드 경로 생성 완료: {}", uploadDir);
                }

                // 파일 저장
                file.transferTo(savePath);
                log.info("✅ 파일 저장 완료: {}", savePath);

                // 클라이언트에서 접근 가능한 URL 설정
                String thumbnailUrl = "/uploads/" + fileName;
                goalDTO.setThumbnail(fileName); // 저장된 파일명 설정
                goalDTO.setThumbnailUrl(thumbnailUrl); // 접근 가능한 URL 설정
            } else {
                log.info("📂 파일이 제공되지 않음.");
            }

            // 🛠 목표 데이터베이스 저장
            Long goalId = goalService.register(goalDTO);
            log.info("✅ 목표 등록 완료, ID: {}", goalId);

            // 응답 데이터 생성
            Map<String, Object> response = new HashMap<>();
            response.put("goalId", goalId);
            response.put("thumbnailUrl", goalDTO.getThumbnailUrl());

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

    // 목표 참가
    @PostMapping("/{goalId}/join")
    public void joinGoal(@PathVariable Long goalId, @RequestBody Map<String, Object> requestData) {
        Long memberId = Long.valueOf(requestData.get("memberId").toString());
        log.info("목표 참가 요청: goalId={}, memberId={}", goalId, memberId);
        goalService.join(goalId, memberId);
    }

    // 목표 수정
    @PutMapping("/update")
    public Long updateGoal(@RequestBody GoalDTO goalDTO) {
        log.info("목표 수정 요청: {}", goalDTO);
        return goalService.update(goalDTO);
    }

    // 목표 삭제
    @DeleteMapping("/{goalId}")
    public void deleteGoal(@PathVariable Long goalId) {
        log.info("목표 삭제 요청: goalId={}", goalId);
        goalService.delete(goalId);
    }
}
