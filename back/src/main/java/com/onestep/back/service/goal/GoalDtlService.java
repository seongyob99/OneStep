package com.onestep.back.service.goal;

import com.onestep.back.dto.GoalDTO;
import com.onestep.back.dto.goal.CertDTO;
import com.onestep.back.dto.goal.GoalDtlDTO;

import java.util.List;

public interface GoalDtlService {

    GoalDtlDTO getGoalInfo(Long goalId);

    List<CertDTO> getRecentCert(Long goalId);

    void joinGoal(GoalDTO goalDTO);

    void removeMember(GoalDTO goalDTO);
}
