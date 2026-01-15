package com.delightdisplay.dto;

import com.delightdisplay.entity.CartItem;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemDto {
    private String id;

    @NotNull(message = "Product ID is required")
    private String productId;

    private String name;
    private String image;
    private String category;
    private BigDecimal price;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    public static CartItemDto fromEntity(CartItem item) {
        CartItemDto dto = new CartItemDto();
        dto.setId(String.valueOf(item.getId()));
        dto.setProductId(String.valueOf(item.getProduct().getId()));
        dto.setName(item.getProduct().getName());
        dto.setImage(item.getProduct().getImage());
        dto.setCategory(item.getProduct().getCategory() != null ? item.getProduct().getCategory().getName() : null);
        dto.setPrice(item.getProduct().getPrice());
        dto.setQuantity(item.getQuantity());
        return dto;
    }
}
