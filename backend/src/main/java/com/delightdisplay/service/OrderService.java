package com.delightdisplay.service;

import com.delightdisplay.dto.CreateOrderRequest;
import com.delightdisplay.dto.OrderDto;
import com.delightdisplay.entity.*;
import com.delightdisplay.exception.BadRequestException;
import com.delightdisplay.exception.ResourceNotFoundException;
import com.delightdisplay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public Page<OrderDto> getMyOrders(Pageable pageable) {
        User user = userService.getCurrentUser();
        return orderRepository.findByUserId(user.getId(), pageable).map(order -> {
            // Force load user within transaction
            order.getUser().getEmail();
            return OrderDto.fromEntity(order);
        });
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(order -> {
            // Force load user within transaction
            order.getUser().getEmail();
            return OrderDto.fromEntity(order);
        });
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(String id) {
        Long orderId = Long.parseLong(id);
        Order order = orderRepository.findByIdWithUser(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User currentUser = userService.getCurrentUser();
        if (!order.getUser().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Access denied");
        }

        return OrderDto.fromEntity(order);
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request) {
        User user = userService.getCurrentUser();
        Cart cart = cartRepository.findByUserIdWithItems(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (!product.isInStock()) {
                throw new BadRequestException("Product " + product.getName() + " is not available");
            }
            if (product.getStockCount() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for " + product.getName());
            }

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .build();
            orderItems.add(orderItem);

            product.setStockCount(product.getStockCount() - cartItem.getQuantity());
            if (product.getStockCount() <= 0) {
                product.setInStock(false);
            }
            productRepository.save(product);
        }

        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .shippingAddress(request.getShippingAddress())
                .status(Order.OrderStatus.PENDING)
                .paymentStatus(Order.PaymentStatus.PENDING)
                .build();

        order = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.setItems(orderItems);
        order = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        // Send confirmation email
        emailService.sendOrderConfirmationEmail(user, order);

        return OrderDto.fromEntity(order);
    }

    @Transactional
    public OrderDto updateOrderStatus(String id, Order.OrderStatus status) {
        Long orderId = Long.parseLong(id);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setStatus(status);
        order = orderRepository.save(order);

        // Send status update email
        emailService.sendOrderStatusUpdateEmail(order.getUser(), order);

        return OrderDto.fromEntity(order);
    }

    @Transactional
    public OrderDto cancelOrder(String id) {
        Long orderId = Long.parseLong(id);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User currentUser = userService.getCurrentUser();
        if (!order.getUser().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Access denied");
        }

        if (order.getStatus() == Order.OrderStatus.SHIPPED ||
                order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel shipped or delivered order");
        }

        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockCount(product.getStockCount() + item.getQuantity());
            product.setInStock(true);
            productRepository.save(product);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        return OrderDto.fromEntity(orderRepository.save(order));
    }
}
