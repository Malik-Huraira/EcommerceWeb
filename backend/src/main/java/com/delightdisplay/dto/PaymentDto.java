package com.delightdisplay.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentDto {
    private Long orderId;
    private String paymentIntentId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String clientSecret;
}
