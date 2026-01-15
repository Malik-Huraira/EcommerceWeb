package com.delightdisplay.service;

import com.delightdisplay.dto.ProductDto;
import com.delightdisplay.entity.Category;
import com.delightdisplay.entity.Product;
import com.delightdisplay.exception.ResourceNotFoundException;
import com.delightdisplay.repository.CategoryRepository;
import com.delightdisplay.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(ProductDto::fromEntity);
    }

    public Page<ProductDto> searchProducts(
            String name, Long categoryId, String category, BigDecimal minPrice, BigDecimal maxPrice,
            Boolean inStock, Boolean featured, Boolean isNew, Pageable pageable) {
        // If no filters provided, use simple findAll for better performance
        if (name == null && categoryId == null && category == null && minPrice == null &&
                maxPrice == null && inStock == null && featured == null && isNew == null) {
            return productRepository.findAll(pageable).map(ProductDto::fromEntity);
        }
        return productRepository
                .findWithFilters(name, categoryId, category, minPrice, maxPrice, inStock, featured, isNew, pageable)
                .map(ProductDto::fromEntity);
    }

    public ProductDto getProductById(String id) {
        Long productId = Long.parseLong(id);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return ProductDto.fromEntity(product);
    }

    @Cacheable(value = "featuredProducts")
    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "newProducts")
    public List<ProductDto> getNewProducts() {
        return productRepository.findByIsNewTrue().stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "featuredProducts", allEntries = true),
            @CacheEvict(value = "newProducts", allEntries = true),
            @CacheEvict(value = "categories", allEntries = true)
    })
    public ProductDto createProduct(ProductDto dto) {
        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .originalPrice(dto.getOriginalPrice())
                .stockCount(dto.getStockCount() != null ? dto.getStockCount() : 0)
                .image(dto.getImage())
                .images(dto.getImages())
                .inStock(dto.isInStock())
                .featured(dto.isFeatured())
                .isNew(dto.isNew())
                .tags(dto.getTags())
                .build();

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        return ProductDto.fromEntity(productRepository.save(product));
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "featuredProducts", allEntries = true),
            @CacheEvict(value = "newProducts", allEntries = true),
            @CacheEvict(value = "categories", allEntries = true)
    })
    public ProductDto updateProduct(String id, ProductDto dto) {
        Long productId = Long.parseLong(id);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (dto.getName() != null)
            product.setName(dto.getName());
        if (dto.getDescription() != null)
            product.setDescription(dto.getDescription());
        if (dto.getPrice() != null)
            product.setPrice(dto.getPrice());
        if (dto.getOriginalPrice() != null)
            product.setOriginalPrice(dto.getOriginalPrice());
        if (dto.getStockCount() != null)
            product.setStockCount(dto.getStockCount());
        if (dto.getImage() != null)
            product.setImage(dto.getImage());
        if (dto.getImages() != null)
            product.setImages(dto.getImages());
        if (dto.getTags() != null)
            product.setTags(dto.getTags());
        product.setInStock(dto.isInStock());
        product.setFeatured(dto.isFeatured());
        product.setNew(dto.isNew());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        return ProductDto.fromEntity(productRepository.save(product));
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "featuredProducts", allEntries = true),
            @CacheEvict(value = "newProducts", allEntries = true),
            @CacheEvict(value = "categories", allEntries = true)
    })
    public void deleteProduct(String id) {
        Long productId = Long.parseLong(id);
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(productId);
    }
}
