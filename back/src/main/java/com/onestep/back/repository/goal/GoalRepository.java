package com.onestep.back.repository.goal;

import com.onestep.back.domain.Goals;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;

public interface GoalRepository extends JpaRepository<Goals, Long> {
    Page<Goals> findByCategoryCateNameContainingAndTitleContaining(String categoryName, String title, Pageable pageable);
}