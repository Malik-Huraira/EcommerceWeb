package com.delightdisplay.service;

import com.delightdisplay.dto.CategoryDto;
import com.delightdisplay.entity.Category;
import com.delightdisplay.exception.BadRequestException;
import com.delightdisplay.exception.ResourceNotFoundException;
import com.delightdisplay.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Cacheable(value = "categories")
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return CategoryDto.fromEntity(category);
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Category already exists");
        }
        Category category = Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .imageUrl(dto.getImage())
                .build();
        return CategoryDto.fromEntity(categoryRepository.save(category));
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (dto.getName() != null && !dto.getName().equals(category.getName())) {
            if (categoryRepository.existsByName(dto.getName())) {
                throw new BadRequestException("Category name already exists");
            }
            category.setName(dto.getName());
        }
        if (dto.getDescription() != null)
            category.setDescription(dto.getDescription());
        if (dto.getImage() != null)
            category.setImageUrl(dto.getImage());

        return CategoryDto.fromEntity(categoryRepository.save(category));
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (!category.getProducts().isEmpty()) {
            throw new BadRequestException("Cannot delete category with products");
        }
        categoryRepository.delete(category);
    }
}
