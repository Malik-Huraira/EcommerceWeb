package com.delightdisplay.service;

import com.delightdisplay.entity.Order;
import com.delightdisplay.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@delightdisplay.com}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:8080}")
    private String frontendUrl;

    @Async
    public void sendWelcomeEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Welcome to Delight Display Zone!");
            message.setText(String.format(
                "Hi %s,\n\n" +
                "Welcome to Delight Display Zone! Your account has been created successfully.\n\n" +
                "Start shopping now: %s\n\n" +
                "Best regards,\nDelight Display Zone Team",
                user.getName(), frontendUrl
            ));
            mailSender.send(message);
            log.info("Welcome email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(User user, String resetToken) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Reset Your Password - Delight Display Zone");
            message.setText(String.format(
                "Hi %s,\n\n" +
                "You requested to reset your password. Click the link below:\n\n" +
                "%s\n\n" +
                "This link expires in 1 hour.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Best regards,\nDelight Display Zone Team",
                user.getName(), resetLink
            ));
            mailSender.send(message);
            log.info("Password reset email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendOrderConfirmationEmail(User user, Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Order Confirmed #" + order.getId() + " - Delight Display Zone");
            message.setText(String.format(
                "Hi %s,\n\n" +
                "Thank you for your order!\n\n" +
                "Order #: %d\n" +
                "Total: $%.2f\n" +
                "Shipping to: %s\n\n" +
                "Track your order: %s/orders/%d\n\n" +
                "Best regards,\nDelight Display Zone Team",
                user.getName(), order.getId(), order.getTotalAmount(), 
                order.getShippingAddress(), frontendUrl, order.getId()
            ));
            mailSender.send(message);
            log.info("Order confirmation email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send order confirmation email: {}", e.getMessage());
        }
    }

    @Async
    public void sendOrderStatusUpdateEmail(User user, Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Order Update #" + order.getId() + " - Delight Display Zone");
            message.setText(String.format(
                "Hi %s,\n\n" +
                "Your order #%d status has been updated to: %s\n\n" +
                "Track your order: %s/orders/%d\n\n" +
                "Best regards,\nDelight Display Zone Team",
                user.getName(), order.getId(), order.getStatus().name(),
                frontendUrl, order.getId()
            ));
            mailSender.send(message);
            log.info("Order status update email sent to {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send order status email: {}", e.getMessage());
        }
    }
}
