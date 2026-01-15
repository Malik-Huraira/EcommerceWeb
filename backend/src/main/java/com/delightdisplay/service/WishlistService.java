package com.delightdisplay.service;

import com.delightdisplay.dto.WishlistDto;
import com.delightdisplay.entity.*;
import com.delightdisplay.exception.BadRequestException;
import com.delightdisplay.exception.ResourceNotFoundException;
import com.delightdisplay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public WishlistDto getWishlist() {
        User user = userService.getCurrentUser();
        Wishlist wishlist = wishlistRepository.findByUserIdWithItems(user.getId())
                .orElseGet(() -> createWishlistForUser(user));
        return WishlistDto.fromEntity(wishlist);
    }

    @Transactional
    public WishlistDto addToWishlist(String productId) {
        User user = userService.getCurrentUser();
        Wishlist wishlist = wishlistRepository.findByUserId(user.getId())
                .orElseGet(() -> createWishlistForUser(user));

        Long prodId = Long.parseLong(productId);
        Product product = productRepository.findById(prodId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), product.getId())) {
            throw new BadRequestException("Product already in wishlist");
        }

        WishlistItem item = WishlistItem.builder()
                .wishlist(wishlist)
                .product(product)
                .build();
        wishlistItemRepository.save(item);

        return getWishlist();
    }

    @Transactional
    public WishlistDto removeFromWishlist(String productId) {
        User user = userService.getCurrentUser();
        Wishlist wishlist = wishlistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist not found"));

        Long prodId = Long.parseLong(productId);
        wishlistItemRepository.deleteByWishlistIdAndProductId(wishlist.getId(), prodId);
        return getWishlist();
    }

    public boolean isInWishlist(String productId) {
        User user = userService.getCurrentUser();
        Wishlist wishlist = wishlistRepository.findByUserId(user.getId()).orElse(null);
        if (wishlist == null)
            return false;

        Long prodId = Long.parseLong(productId);
        return wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), prodId);
    }

    @Transactional
    public void clearWishlist() {
        User user = userService.getCurrentUser();
        Wishlist wishlist = wishlistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist not found"));
        wishlist.getItems().clear();
        wishlistRepository.save(wishlist);
    }

    private Wishlist createWishlistForUser(User user) {
        Wishlist wishlist = Wishlist.builder().user(user).build();
        return wishlistRepository.save(wishlist);
    }
}
