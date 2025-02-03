package com.onestep.back.controller.goal;

import com.onestep.back.dto.goal.GoalDTO;
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

        // 🛠 로그인된 사용자 ID 가져오기 (추후 로그인 연동 시 사용 가능)
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

        // 🔹 memberId 및 categoryId 설정 (추후 DB 저장을 위해 DTO에 값 할당)
        goalDTO.setMemberId(memberId);
        goalDTO.setCategoryId(categoryId);

        if (goalDTO.getEndDate() == null && goalDTO.getStartDate() != null) {
            goalDTO.setEndDate(goalDTO.getStartDate().plusMonths(6));
            log.info("📌 endDate가 없어 기본값 설정됨: {}", goalDTO.getEndDate());
        }

        try {
            // ✅ 필수 값 검증
            if (goalDTO.getTitle() == null || goalDTO.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("❌ 제목은 필수입니다.");
            }
            if (goalDTO.getDescription() == null || goalDTO.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("❌ 설명은 필수입니다.");
            }
            if (categoryId == null) {
                return ResponseEntity.badRequest().body("❌ 카테고리를 선택해야 합니다.");
            }
            if (goalDTO.getStartDate() == null) {
                return ResponseEntity.badRequest().body("❌ 시작 날짜는 필수입니다.");
            }

            // ✅ 참가 인원 검증 (1 이상 숫자만 허용)
            if (goalDTO.getParticipants() == null || goalDTO.getParticipants() < 1) {
                return ResponseEntity.badRequest().body("❌ 참가 인원은 1명 이상이어야 합니다.");
            }
            if (String.valueOf(goalDTO.getParticipants()).matches("^0[0-9]+$")) {
                return ResponseEntity.badRequest().body("❌ 참가 인원은 0으로 시작할 수 없습니다.");
            }

            // ✅ 인증 주기 검증 (1 이상 숫자만 허용)
            if (goalDTO.getCertCycle() == null || goalDTO.getCertCycle() < 1) {
                return ResponseEntity.badRequest().body("❌ 인증 주기는 1 이상이어야 합니다.");
            }
            if (String.valueOf(goalDTO.getCertCycle()).matches("^0[0-9]+$")) {
                return ResponseEntity.badRequest().body("❌ 인증 주기는 0으로 시작할 수 없습니다.");
            }

            // 🛠 파일 업로드 처리
            if (file != null && !file.isEmpty()) {
                log.info("📂 파일 업로드 시작: {}", file.getOriginalFilename());

                // 🔹 파일명 생성 (UUID + 원본 파일명 조합)
                String uuid = UUID.randomUUID().toString();
                String fileName = uuid + "_" + file.getOriginalFilename();
                Path savePath = Paths.get(uploadPath, fileName);

                log.info("📂 파일 저장 경로: {}", savePath);

                // 🔹 업로드 경로가 존재하지 않으면 생성
                Path uploadDir = Paths.get(uploadPath);
                if (Files.notExists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                    log.info("📂 업로드 경로 생성 완료: {}", uploadDir);
                }

                // 🔹 파일 저장
                file.transferTo(savePath);
                log.info("✅ 파일 저장 완료: {}", savePath);

                // ✅ DB에는 파일명만 저장 (URL은 조회 시 동적으로 생성)
                goalDTO.setThumbnail(fileName);
            } else {
                log.info("📂 파일이 제공되지 않음. 기본값 유지");
            }

            // 🛠 목표 데이터베이스 저장
            Long goalId = goalService.register(goalDTO);
            log.info("✅ 목표 등록 완료, ID: {}", goalId);

            // 🔹 응답 데이터 생성 (등록된 목표 ID 반환)
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
