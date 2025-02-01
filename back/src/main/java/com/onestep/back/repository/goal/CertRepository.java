package com.onestep.back.repository.goal;

import com.onestep.back.domain.CertificationId;
import com.onestep.back.domain.Certifications;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CertRepository extends JpaRepository<Certifications, CertificationId> {

    // 최근 인증 기록 탑4 조회
    @Query("SELECT c FROM Certifications c WHERE c.goal.goalId = :goalId ORDER BY c.regDate DESC")
    List<Certifications> findRecentCertificationsByGoalId(@Param("goalId") Long goalId, Pageable pageable);

    // 내보내기, 그만두기 시 삭제할 인증 기록 조회
    List<Certifications> findByGoalGoalIdAndMemberMemberId(Long goalId, String memberId);
}
