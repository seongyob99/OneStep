package com.onestep.back.repository.goal;

import com.onestep.back.domain.CertificationId;
import com.onestep.back.domain.Certifications;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CertRepository extends JpaRepository<Certifications, CertificationId> {

    @Query("SELECT c FROM Certifications c WHERE c.goal.goalId = :goalId ORDER BY c.regDate DESC")
    List<Certifications> findRecentCertificationsByGoalId(@Param("goalId") Long goalId, Pageable pageable);
}
