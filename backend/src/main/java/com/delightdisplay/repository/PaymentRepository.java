package com.delightdisplay.repository;

import com.delightdisplay.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentIntentId(String paymentIntentId);

    Optional<Payment> findByOrderId(Long orderId);
}
