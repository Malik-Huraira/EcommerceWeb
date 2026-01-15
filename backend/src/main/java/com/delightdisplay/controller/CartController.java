package com.delightdisplay.controller;

import com.delightdisplay.dto.CartDto;
import com.delightdisplay.dto.CartItemDto;
import com.delightdisplay.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart endpoints")
public class CartController {
    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get current user's cart")
    public ResponseEntity<CartDto> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart")
    public ResponseEntity<CartDto> addToCart(@Valid @RequestBody CartItemDto dto) {
        return ResponseEntity.ok(cartService.addToCart(dto));
    }

    @PutMapping("/items/{productId}")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<CartDto> updateCartItem(
            @PathVariable String productId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateCartItem(productId, quantity));
    }

    @DeleteMapping("/items/{productId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<CartDto> removeFromCart(@PathVariable String productId) {
        return ResponseEntity.ok(cartService.removeFromCart(productId));
    }

    @DeleteMapping
    @Operation(summary = "Clear cart")
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}
