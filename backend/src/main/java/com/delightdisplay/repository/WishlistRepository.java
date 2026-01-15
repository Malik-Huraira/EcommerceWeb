package com.delightdisplay.repository;

import com.delightdisplay.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    @Query("SELECT w FROM Wishlist w LEFT JOIN FETCH w.items i LEFT JOIN FETCH i.product WHERE w.user.id = :userId")
    Optional<Wishlist> findByUserIdWithItems(Long userId);

    Optional<Wishlist> findByUserId(Long userId);
}
