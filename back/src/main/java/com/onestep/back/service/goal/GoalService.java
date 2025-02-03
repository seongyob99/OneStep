package com.onestep.back.service.goal;

import com.onestep.back.dto.goal.GoalDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GoalService {
    Page<GoalDTO> getPagedList(String categoryName, String title, Pageable pageable); // 목표 목록 조회 (페이징)

    Long register(GoalDTO goalDTO); // 목표 등록

    void join(Long goalId, Long memberId); // 목표 참가

    Long update(GoalDTO goalDTO); // 목표 수정

    void delete(Long goalId); // 목표 삭제
}
