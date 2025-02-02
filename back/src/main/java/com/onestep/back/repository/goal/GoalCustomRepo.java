package com.onestep.back.repository.goal;

import com.onestep.back.dto.goal.GoalDtlDTO;

public interface GoalCustomRepo {

    GoalDtlDTO getGoalInfo(Long goalId);
}
