package com.delightdisplay.service;

import com.delightdisplay.dto.ReviewDto;
import com.delightdisplay.entity.*;
import com.delightdisplay.exception.BadRequestException;
import com.delightdisplay.exception.ResourceNotFoundException;
import com.delightdisplay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public Page<ReviewDto> getProductReviews(String productId, Pageable pageable) {
        Long prodId = Long.parseLong(productId);
        return reviewRepository.findByProductId(prodId, pageable).map(ReviewDto::fromEntity);
    }

    @Transactional
    public ReviewDto createReview(ReviewDto dto) {
        User user = userService.getCurrentUser();
        Long productId = Long.parseLong(dto.getProductId());
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (reviewRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            throw new BadRequestException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        return ReviewDto.fromEntity(reviewRepository.save(review));
    }

    @Transactional
    public ReviewDto updateReview(String id, ReviewDto dto) {
        Long reviewId = Long.parseLong(id);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        User currentUser = userService.getCurrentUser();
        if (!review.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only update your own reviews");
        }

        if (dto.getRating() != null)
            review.setRating(dto.getRating());
        if (dto.getComment() != null)
            review.setComment(dto.getComment());

        return ReviewDto.fromEntity(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(String id) {
        Long reviewId = Long.parseLong(id);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        User currentUser = userService.getCurrentUser();
        if (!review.getUser().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Access denied");
        }

        reviewRepository.delete(review);
    }
}
