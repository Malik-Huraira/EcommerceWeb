package com.delightdisplay.dto;

import com.delightdisplay.entity.Review;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDto {
    private String id;

    @NotNull(message = "Product ID is required")
    private String productId;

    private String userId;
    private String userName;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    private String comment;
    private LocalDateTime createdAt;

    public static ReviewDto fromEntity(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(String.valueOf(review.getId()));
        dto.setProductId(String.valueOf(review.getProduct().getId()));
        dto.setUserId(String.valueOf(review.getUser().getId()));
        dto.setUserName(review.getUser().getName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}
