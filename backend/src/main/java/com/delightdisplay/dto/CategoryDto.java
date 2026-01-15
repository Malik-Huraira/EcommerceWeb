package com.delightdisplay.dto;

import com.delightdisplay.entity.Category;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryDto {
    private String id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;
    private String image;
    private int count;

    public static CategoryDto fromEntity(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(String.valueOf(category.getId()));
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setImage(category.getImageUrl());
        dto.setCount(category.getProducts() != null ? category.getProducts().size() : 0);
        return dto;
    }
}
