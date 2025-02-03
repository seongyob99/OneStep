package com.onestep.back.service.goal;

import com.onestep.back.dto.goal.GoalDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface GoalService {
    List<GoalDTO> getList(Long categoryId, String title);

    Long register(GoalDTO goalDTO); // 목표 등록

}
