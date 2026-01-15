package com.delightdisplay.dto;

import com.delightdisplay.entity.Order;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderDto {
    private String id;
    private String userId;
    private String userEmail;
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private String paymentId;
    private String paymentStatus;
    private LocalDateTime createdAt;

    public static OrderDto fromEntity(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(String.valueOf(order.getId()));
        dto.setUserId(String.valueOf(order.getUser().getId()));
        dto.setUserEmail(order.getUser().getEmail());
        dto.setItems(order.getItems().stream()
                .map(OrderItemDto::fromEntity)
                .collect(Collectors.toList()));
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus().name());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPaymentId(order.getPaymentId());
        dto.setPaymentStatus(order.getPaymentStatus().name());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }
}
