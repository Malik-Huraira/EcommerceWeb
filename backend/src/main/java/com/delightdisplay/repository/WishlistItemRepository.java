package com.delightdisplay.repository;

import com.delightdisplay.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    Optional<WishlistItem> findByWishlistIdAndProductId(Long wishlistId, Long productId);

    boolean existsByWishlistIdAndProductId(Long wishlistId, Long productId);

    void deleteByWishlistIdAndProductId(Long wishlistId, Long productId);
}
