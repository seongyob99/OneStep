package com.onestep.back.controller.category;

import com.onestep.back.dto.CategoriesDTO;
import com.onestep.back.service.category.CategoriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoriesRestController {

    private final CategoriesService categoriesService;

    // 모든 카테고리 조회
    @GetMapping
    public ResponseEntity<List<CategoriesDTO>> getAllCategories() {
        return ResponseEntity.ok(categoriesService.getAllCategories());
    }

    // 특정 카테고리 조회
    @GetMapping("/{id}")
    public ResponseEntity<CategoriesDTO> getCategoryById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(categoriesService.getCategoryById(id));
    }

    // 카테고리 추가
    @PostMapping
    public ResponseEntity<Long> addCategory(@RequestBody CategoriesDTO categoriesDTO) {
        return ResponseEntity.ok(categoriesService.addCategory(categoriesDTO));
    }

    // 카테고리 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateCategory(@PathVariable("id") Long id, @RequestBody CategoriesDTO categoriesDTO) {
        categoriesService.updateCategory(id, categoriesDTO);
        return ResponseEntity.noContent().build();
    }

    // 카테고리 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Long id) {
        categoriesService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}