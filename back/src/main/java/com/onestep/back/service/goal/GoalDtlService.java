package com.onestep.back.service.goal;

import com.onestep.back.dto.goal.GoalDTO;
import com.onestep.back.dto.upload.CertificationsDTO;
import com.onestep.back.dto.goal.GoalDtlDTO;

import java.util.List;

public interface GoalDtlService {

    GoalDtlDTO getGoalInfo(Long goalId);

    List<CertificationsDTO> getRecentCert(Long goalId);

    void joinGoal(GoalDTO goalDTO);

    void removeMember(GoalDTO goalDTO);

    void updateGoal(GoalDTO goalDTO);

    void deleteGoal(Long goalId);
}
