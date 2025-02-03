package com.onestep.back.service.category;

import com.onestep.back.dto.category.CategoriesDTO;

import java.util.List;

public interface CategoriesService {
    List<CategoriesDTO> getAllCategories(); // 모든 카테고리 조회
    CategoriesDTO getCategoryById(Long categoryId); // ID로 특정 카테고리 조회
    Long addCategory(CategoriesDTO categoriesDTO); // 카테고리 추가
    void updateCategory(Long categoryId, CategoriesDTO categoriesDTO); // 카테고리 수정
    void deleteCategory(Long categoryId); // 카테고리 삭제
}