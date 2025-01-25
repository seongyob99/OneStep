package com.onestep.back.repository.category;

import com.onestep.back.domain.Categories;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriesRepository extends JpaRepository<Categories, Long> {
    // 필요한 경우 추가적인 조회 메서드 정의 가능
}