package com.onestep.back.repository.Upload;

import com.onestep.back.domain.Goals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface GoalsRepository extends JpaRepository<Goals, Long> {
}
