package com.onestep.back.controller.goal;

import com.onestep.back.dto.GoalDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequestMapping("/goals/dtl")
@RequiredArgsConstructor
public class GoalDtlRestController {

    // 목표 정보 조회
    @PostMapping("/getGoalInfo")
    public GoalDTO getGoalInfo(@RequestBody GoalDTO goalDTO) {
        log.info(goalDTO);
        return null;
    }

    // 내보내기, 그만두기

    // 최근 인증 기록 탑4 조회
    @PostMapping("/getRecentCert")
    public GoalDTO getRecentCert(@RequestBody GoalDTO goalDTO) {
        return null;
    }
}
