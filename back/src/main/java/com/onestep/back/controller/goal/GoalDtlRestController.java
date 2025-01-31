package com.onestep.back.controller.goal;

import com.onestep.back.dto.GoalDTO;
import com.onestep.back.dto.goal.CertDTO;
import com.onestep.back.dto.goal.GoalDtlDTO;
import com.onestep.back.service.goal.GoalDtlService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/goals/dtl")
@RequiredArgsConstructor
public class GoalDtlRestController {

    private final GoalDtlService goalDtlService;

    // 목표 정보 조회
    @PostMapping("/{goalId}")
    public GoalDtlDTO getGoalInfo(@PathVariable Long goalId) {
        return goalDtlService.getGoalInfo(goalId);
    }

    // 내보내기, 그만두기
    @PostMapping("/removeMember")
    public GoalDtlDTO getGoalInfo(@RequestBody GoalDTO goalId) {
        // 로직 추가
        return null;
    }

    // 최근 인증기록 조회
    @PostMapping("/getRecentCert/{goalId}")
    public List<CertDTO> getRecentCert(@PathVariable Long goalId) {
        return goalDtlService.getRecentCert(goalId);
    }
}
