package com.delightdisplay.dto;

import com.delightdisplay.entity.Product;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDto {
    private String id;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    private BigDecimal originalPrice;

    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stockCount;

    private String image;
    private List<String> images;
    private boolean inStock;
    private boolean featured;
    private boolean isNew;
    private List<String> tags;
    private String category;
    private Long categoryId;
    private Double rating;
    private int reviews;

    public static ProductDto fromEntity(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(String.valueOf(product.getId()));
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setStockCount(product.getStockCount());
        dto.setImage(product.getImage());
        dto.setImages(product.getImages());
        dto.setInStock(product.isInStock());
        dto.setFeatured(product.isFeatured());
        dto.setNew(product.isNew());
        dto.setTags(product.getTags());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategory(product.getCategory().getName());
        }
        dto.setRating(product.getRating());
        dto.setReviews(product.getReviewCount());
        return dto;
    }
}
