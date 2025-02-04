package com.onestep.back.controller.goal;

import com.onestep.back.dto.goal.GoalDTO;
import com.onestep.back.dto.upload.CertificationsDTO;
import com.onestep.back.dto.goal.GoalDtlDTO;
import com.onestep.back.service.goal.GoalDtlService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@RestController
@RequestMapping("/goals/dtl")
@RequiredArgsConstructor
public class GoalDtlRestController {

    @Value("${com.onestep.upload.path}")
    private String uploadPath;

    private final GoalDtlService goalDtlService;

    // 목표 정보 조회
    @PostMapping("/{goalId}")
    public GoalDtlDTO getGoalInfo(@PathVariable Long goalId) {
        return goalDtlService.getGoalInfo(goalId);
    }

    // 참가하기
    @PostMapping("/joinGoal")
    public Map<String, GoalDTO> joinGoal(@RequestBody GoalDTO goalDTO) {
        goalDtlService.joinGoal(goalDTO);
        return Map.of("goalDTO", goalDTO);
    }

    // 내보내기, 그만두기
    @PostMapping("/removeMember")
    public Map<String, GoalDTO> removeMember(@RequestBody GoalDTO goalDTO) {
        goalDtlService.removeMember(goalDTO);
        return Map.of("goalDTO", goalDTO);
    }

    // 수정하기
    @PutMapping(value = "/updateGoal", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Long> updateGoal(@ModelAttribute GoalDTO goalDTO) {
        // 썸네일 변경
        if(goalDTO.getFile() != null && !goalDTO.getFile().isEmpty()) {
            // 기존 파일 지우기
            if (goalDTO.getThumbnail() != null) {
                String filePath = uploadPath + "\\" + goalDTO.getThumbnail();
                File file = new File(filePath);
                if (file.exists()) {
                    file.delete();
                }
            }
            // 새로 업로드
            MultipartFile file = goalDTO.getFile();
            String fileName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            Path savePath = Paths.get(uploadPath, uuid + "_" + fileName);

            try {
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image")) {
                    throw new IllegalArgumentException("Uploaded file is not an image.");
                }

                file.transferTo(savePath);
                goalDTO.setThumbnail(uuid + "_" + fileName);

            } catch (IOException e) {
                throw new RuntimeException("Failed to upload file", e);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid file type: " + fileName, e);
            }
        }
        // 저장
        goalDtlService.updateGoal(goalDTO);
        return Map.of("goalId", goalDTO.getGoalId());
    }

    // 삭제하기
    @DeleteMapping("/{goalId}")
    public Map<String, Long> deleteGoal(@PathVariable Long goalId) {
        goalDtlService.deleteGoal(goalId);
        return Map.of("goalId", goalId);
    }

    // 최근 인증기록 조회
    @PostMapping("/getRecentCert/{goalId}")
    public List<CertificationsDTO> getRecentCert(@PathVariable Long goalId) {
        return goalDtlService.getRecentCert(goalId);
    }
}
