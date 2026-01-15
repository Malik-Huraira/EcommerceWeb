package com.delightdisplay.dto;

import com.delightdisplay.entity.Cart;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class CartDto {
    private String id;
    private List<CartItemDto> items;
    private BigDecimal totalPrice;
    private int totalItems;

    public static CartDto fromEntity(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(String.valueOf(cart.getId()));
        dto.setItems(cart.getItems().stream()
                .map(CartItemDto::fromEntity)
                .collect(Collectors.toList()));
        dto.setTotalPrice(cart.getTotalPrice());
        dto.setTotalItems(cart.getTotalItems());
        return dto;
    }
}
