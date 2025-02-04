package com.onestep.back.service.category;

import com.onestep.back.domain.Categories;
import com.onestep.back.dto.category.CategoriesDTO;
import com.onestep.back.repository.category.CategoriesRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriesServiceImpl implements CategoriesService {

    private final CategoriesRepository categoriesRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<CategoriesDTO> getAllCategories() {
        return categoriesRepository.findAll(Sort.by(Sort.Order.asc("categoryId")))
                .stream()
                .map(category -> modelMapper.map(category, CategoriesDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public CategoriesDTO getCategoryById(Long categoryId) {
        Categories category = categoriesRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        return modelMapper.map(category, CategoriesDTO.class);
    }

    @Override
    public Long addCategory(CategoriesDTO categoriesDTO) {
        Categories category = modelMapper.map(categoriesDTO, Categories.class);
        Categories savedCategory = categoriesRepository.save(category);
        return savedCategory.getCategoryId();
    }

    @Override
    public void updateCategory(Long categoryId, CategoriesDTO categoriesDTO) {
        Categories category = categoriesRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // ModelMapper를 사용해 DTO 값을 엔티티에 업데이트
        modelMapper.map(categoriesDTO, category);

        categoriesRepository.save(category);
    }

    @Override
    public void deleteCategory(Long categoryId) {
        categoriesRepository.deleteById(categoryId);
    }
}