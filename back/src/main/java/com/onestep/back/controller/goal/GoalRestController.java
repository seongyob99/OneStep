package com.onestep.back.controller.goal;

import com.onestep.back.dto.GoalDTO;
import com.onestep.back.service.goal.GoalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
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
    public List<GoalDTO> getGoalList(@RequestParam(required = false) String categoryName,
                                     @RequestParam(required = false) String title) {
        log.info("목표 목록 조회 요청: categoryName={}, title={}", categoryName, title);
        return goalService.getList(categoryName, title);
    }

   // 목표 등록
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Long registerGoal(@ModelAttribute GoalDTO goalDTO,
                             @RequestPart(value = "file", required = false) MultipartFile file) {
        log.info("목표 등록 요청: {}", goalDTO);

        // 파일 업로드 처리
        if (file != null && !file.isEmpty()) {
            try {
                String uuid = UUID.randomUUID().toString();
                String fileName = uuid + "_" + file.getOriginalFilename();
                Path savePath = Paths.get(uploadPath, fileName);

                if (Files.notExists(Paths.get(uploadPath))) {
                    Files.createDirectories(Paths.get(uploadPath)); // 디렉토리 생성
                }

                file.transferTo(savePath); // 파일 저장
                goalDTO.setThumbnail(fileName); // 저장된 파일명 설정
            } catch (IOException e) {
                log.error("파일 업로드 실패", e);
                throw new RuntimeException("파일 업로드 중 오류가 발생했습니다.");
            }
        }

        return goalService.register(goalDTO);
    }

    // 목표 참가
    @PostMapping("/{goalId}/join")
    public void joinGoal(@PathVariable Long goalId, @RequestParam Long memberId) {
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
