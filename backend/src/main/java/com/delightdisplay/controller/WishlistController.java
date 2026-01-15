package com.delightdisplay.controller;

import com.delightdisplay.dto.WishlistDto;
import com.delightdisplay.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Wishlist endpoints")
public class WishlistController {
    private final WishlistService wishlistService;

    @GetMapping
    @Operation(summary = "Get current user's wishlist")
    public ResponseEntity<WishlistDto> getWishlist() {
        return ResponseEntity.ok(wishlistService.getWishlist());
    }

    @PostMapping("/items/{productId}")
    @Operation(summary = "Add product to wishlist")
    public ResponseEntity<WishlistDto> addToWishlist(@PathVariable String productId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(productId));
    }

    @DeleteMapping("/items/{productId}")
    @Operation(summary = "Remove product from wishlist")
    public ResponseEntity<WishlistDto> removeFromWishlist(@PathVariable String productId) {
        return ResponseEntity.ok(wishlistService.removeFromWishlist(productId));
    }

    @GetMapping("/check/{productId}")
    @Operation(summary = "Check if product is in wishlist")
    public ResponseEntity<Map<String, Boolean>> isInWishlist(@PathVariable String productId) {
        return ResponseEntity.ok(Map.of("inWishlist", wishlistService.isInWishlist(productId)));
    }

    @DeleteMapping
    @Operation(summary = "Clear wishlist")
    public ResponseEntity<Void> clearWishlist() {
        wishlistService.clearWishlist();
        return ResponseEntity.noContent().build();
    }
}
