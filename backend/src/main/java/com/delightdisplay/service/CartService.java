package com.delightdisplay.service;

import com.delightdisplay.dto.CartDto;
import com.delightdisplay.dto.CartItemDto;
import com.delightdisplay.entity.*;
import com.delightdisplay.exception.BadRequestException;
import com.delightdisplay.exception.ResourceNotFoundException;
import com.delightdisplay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public CartDto getCart() {
        User user = userService.getCurrentUser();
        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
                .orElseGet(() -> createCartForUser(user));
        return CartDto.fromEntity(cart);
    }

    @Transactional
    public CartDto addToCart(CartItemDto dto) {
        User user = userService.getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createCartForUser(user));

        Long productId = Long.parseLong(dto.getProductId());
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.isInStock()) {
            throw new BadRequestException("Product is not available");
        }

        int quantity = dto.getQuantity() != null ? dto.getQuantity() : 1;

        if (product.getStockCount() < quantity) {
            throw new BadRequestException("Insufficient stock");
        }

        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + quantity;
            if (product.getStockCount() < newQuantity) {
                throw new BadRequestException("Insufficient stock");
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cartItemRepository.save(item);
        }

        return getCart();
    }

    @Transactional
    public CartDto updateCartItem(String productId, int quantity) {
        User user = userService.getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        Long prodId = Long.parseLong(productId);
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), prodId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not in cart"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            if (item.getProduct().getStockCount() < quantity) {
                throw new BadRequestException("Insufficient stock");
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCart();
    }

    @Transactional
    public CartDto removeFromCart(String productId) {
        User user = userService.getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        Long prodId = Long.parseLong(productId);
        cartItemRepository.deleteByCartIdAndProductId(cart.getId(), prodId);
        return getCart();
    }

    @Transactional
    public void clearCart() {
        User user = userService.getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart createCartForUser(User user) {
        Cart cart = Cart.builder().user(user).build();
        return cartRepository.save(cart);
    }
}
