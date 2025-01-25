package com.onestep.back.service.goal;

import com.onestep.back.dto.GoalDTO;

import java.util.List;


public interface GoalService {
    List<GoalDTO> getList(String categoryName, String title); // 목표 목록 조회

    Long register(GoalDTO goalDTO); // 목표 등록

    void join(Long goalId, Long memberId); // 목표 참가

    Long update(GoalDTO goalDTO); // 목표 수정

    void delete(Long goalId); // 목표 삭제
}