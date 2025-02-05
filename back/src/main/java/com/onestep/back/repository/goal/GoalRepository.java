package com.onestep.back.repository.goal;

import com.onestep.back.domain.Goals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goals, Long>, GoalCustomRepo {

    List<Goals> findByCategoryCategoryIdAndTitleContaining(Long categoryId, String title);
    List<Goals> findByTitleContaining(String title);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO goals_members (goal_id, member_id) VALUES (:goalId, :memberId)", nativeQuery = true)
    void addMemberToGoal(@Param("goalId") Long goalId, @Param("memberId") String memberId);

    // 참가 인원수
    @Query("SELECT g FROM Goals g LEFT JOIN FETCH g.members WHERE g.goalId = :goalId")
    Goals findByIdWithMembers(@Param("goalId") Long goalId);
}