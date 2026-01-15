package com.delightdisplay.controller;

import com.delightdisplay.dto.PaymentDto;
import com.delightdisplay.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment endpoints")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-intent/{orderId}")
    @Operation(summary = "Create payment intent for an order")
    public ResponseEntity<PaymentDto> createPaymentIntent(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.createPaymentIntent(orderId));
    }

    @PostMapping("/confirm/{paymentIntentId}")
    @Operation(summary = "Confirm payment")
    public ResponseEntity<PaymentDto> confirmPayment(@PathVariable String paymentIntentId) {
        return ResponseEntity.ok(paymentService.confirmPayment(paymentIntentId));
    }

    @GetMapping("/status/{paymentIntentId}")
    @Operation(summary = "Get payment status")
    public ResponseEntity<PaymentDto> getPaymentStatus(@PathVariable String paymentIntentId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(paymentIntentId));
    }
}
