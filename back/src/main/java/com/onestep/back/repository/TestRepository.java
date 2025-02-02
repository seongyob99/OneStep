package com.onestep.back.repository;

import com.onestep.back.domain.Test;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestRepository extends JpaRepository<Test, Long>, TestSearch {

}
