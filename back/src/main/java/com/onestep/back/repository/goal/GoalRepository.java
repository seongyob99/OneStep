package com.onestep.back.repository.goal;

import com.onestep.back.domain.Goals;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goals, Long>, GoalCustomRepo {

    List<Goals> findByCategoryCategoryIdAndTitleContaining(Long categoryId, String title, Sort sort);
    List<Goals> findByTitleContaining(String title, Sort sort);
}