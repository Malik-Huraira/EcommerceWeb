package com.delightdisplay.dto;

import com.delightdisplay.entity.OrderItem;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDto {
    private String id;
    private String productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private BigDecimal price;

    public static OrderItemDto fromEntity(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(String.valueOf(item.getId()));
        dto.setProductId(String.valueOf(item.getProduct().getId()));
        dto.setProductName(item.getProduct().getName());
        dto.setProductImage(item.getProduct().getImage());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        return dto;
    }
}
