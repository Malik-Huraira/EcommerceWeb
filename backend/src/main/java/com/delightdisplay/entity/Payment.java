package com.delightdisplay.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private String paymentIntentId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    @Builder.Default
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentMethod method = PaymentMethod.CARD;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Order.PaymentStatus status = Order.PaymentStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum PaymentMethod {
        CARD, PAYPAL, BANK_TRANSFER
    }
}
