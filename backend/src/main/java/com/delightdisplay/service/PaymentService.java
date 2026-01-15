package com.delightdisplay.service;

import com.delightdisplay.dto.PaymentDto;
import com.delightdisplay.entity.*;
import com.delightdisplay.exception.BadRequestException;
import com.delightdisplay.exception.ResourceNotFoundException;
import com.delightdisplay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserService userService;

    @Transactional
    public PaymentDto createPaymentIntent(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User currentUser = userService.getCurrentUser();
        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Access denied");
        }

        if (order.getPaymentStatus() == Order.PaymentStatus.COMPLETED) {
            throw new BadRequestException("Order already paid");
        }

        // Mock payment intent (replace with Stripe/PayPal integration)
        String paymentIntentId = "pi_" + UUID.randomUUID().toString().replace("-", "");
        String clientSecret = "cs_" + UUID.randomUUID().toString().replace("-", "");

        Payment payment = Payment.builder()
                .order(order)
                .paymentIntentId(paymentIntentId)
                .amount(order.getTotalAmount())
                .currency("USD")
                .method(Payment.PaymentMethod.CARD)
                .status(Order.PaymentStatus.PENDING)
                .build();

        paymentRepository.save(payment);

        order.setPaymentId(paymentIntentId);
        orderRepository.save(order);

        PaymentDto dto = new PaymentDto();
        dto.setOrderId(orderId);
        dto.setPaymentIntentId(paymentIntentId);
        dto.setAmount(order.getTotalAmount());
        dto.setCurrency("USD");
        dto.setStatus("PENDING");
        dto.setClientSecret(clientSecret);

        return dto;
    }

    @Transactional
    public PaymentDto confirmPayment(String paymentIntentId) {
        Payment payment = paymentRepository.findByPaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        // Mock payment confirmation (replace with actual payment verification)
        payment.setStatus(Order.PaymentStatus.COMPLETED);
        paymentRepository.save(payment);

        Order order = payment.getOrder();
        order.setPaymentStatus(Order.PaymentStatus.COMPLETED);
        order.setStatus(Order.OrderStatus.CONFIRMED);
        orderRepository.save(order);

        PaymentDto dto = new PaymentDto();
        dto.setOrderId(order.getId());
        dto.setPaymentIntentId(paymentIntentId);
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setStatus("COMPLETED");

        return dto;
    }

    public PaymentDto getPaymentStatus(String paymentIntentId) {
        Payment payment = paymentRepository.findByPaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        PaymentDto dto = new PaymentDto();
        dto.setOrderId(payment.getOrder().getId());
        dto.setPaymentIntentId(paymentIntentId);
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setStatus(payment.getStatus().name());

        return dto;
    }
}
