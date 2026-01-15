package com.delightdisplay.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateOrderRequest {
    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;
}
