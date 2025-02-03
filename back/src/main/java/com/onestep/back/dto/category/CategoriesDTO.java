package com.onestep.back.dto.category;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriesDTO {
    private Long categoryId;
    private String cateName;
}