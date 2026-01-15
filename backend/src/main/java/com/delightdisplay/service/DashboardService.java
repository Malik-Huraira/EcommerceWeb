package com.delightdisplay.service;

import com.delightdisplay.dto.AnalyticsDto;
import com.delightdisplay.dto.DashboardStatsDto;
import com.delightdisplay.entity.Order;
import com.delightdisplay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public DashboardStatsDto getStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = now.minusDays(7);
        LocalDateTime startOfMonth = now.minusDays(30);

        List<Order> pendingOrders = orderRepository.findByStatusIn(List.of(Order.OrderStatus.PENDING));
        List<Order> shippedOrders = orderRepository.findByStatusIn(List.of(Order.OrderStatus.SHIPPED));
        List<Order> deliveredOrders = orderRepository.findByStatusIn(List.of(Order.OrderStatus.DELIVERED));

        return DashboardStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalOrders(orderRepository.count())
                .totalProducts(productRepository.count())
                .totalRevenue(nullToZero(orderRepository.getTotalRevenue()))
                .ordersToday(nullToZero(orderRepository.countOrdersSince(startOfDay)))
                .ordersThisWeek(nullToZero(orderRepository.countOrdersSince(startOfWeek)))
                .ordersThisMonth(nullToZero(orderRepository.countOrdersSince(startOfMonth)))
                .revenueToday(nullToZero(orderRepository.getRevenueSince(startOfDay)))
                .revenueThisWeek(nullToZero(orderRepository.getRevenueSince(startOfWeek)))
                .revenueThisMonth(nullToZero(orderRepository.getRevenueSince(startOfMonth)))
                .pendingOrders(pendingOrders.size())
                .shippedOrders(shippedOrders.size())
                .deliveredOrders(deliveredOrders.size())
                .build();
    }

    public AnalyticsDto getAnalytics(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        // Daily stats
        List<Object[]> dailyData = orderRepository.getDailyOrderStats(startDate);
        List<AnalyticsDto.DailyStats> dailyStats = dailyData.stream()
                .map(row -> AnalyticsDto.DailyStats.builder()
                        .date(row[0] != null ? row[0].toString() : "")
                        .orders(row[1] != null ? ((Number) row[1]).longValue() : 0)
                        .revenue(row[2] != null ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO)
                        .build())
                .collect(Collectors.toList());

        // Category sales
        List<Object[]> categoryData = orderRepository.getSalesByCategory(startDate);
        List<AnalyticsDto.CategorySales> categorySales = categoryData.stream()
                .map(row -> AnalyticsDto.CategorySales.builder()
                        .category(row[0] != null ? row[0].toString() : "Unknown")
                        .orders(row[1] != null ? ((Number) row[1]).longValue() : 0)
                        .revenue(row[2] != null ? new BigDecimal(row[2].toString()) : BigDecimal.ZERO)
                        .build())
                .collect(Collectors.toList());

        // Top products
        List<Object[]> topData = orderRepository.getTopSellingProducts(startDate, PageRequest.of(0, 5));
        List<AnalyticsDto.TopProduct> topProducts = topData.stream()
                .map(row -> AnalyticsDto.TopProduct.builder()
                        .name(row[0] != null ? row[0].toString() : "Unknown")
                        .sold(row[1] != null ? ((Number) row[1]).longValue() : 0)
                        .build())
                .collect(Collectors.toList());

        // Order status breakdown
        List<Order> pending = orderRepository.findByStatusIn(List.of(Order.OrderStatus.PENDING));
        List<Order> confirmed = orderRepository.findByStatusIn(List.of(Order.OrderStatus.CONFIRMED));
        List<Order> shipped = orderRepository.findByStatusIn(List.of(Order.OrderStatus.SHIPPED));
        List<Order> delivered = orderRepository.findByStatusIn(List.of(Order.OrderStatus.DELIVERED));
        List<Order> cancelled = orderRepository.findByStatusIn(List.of(Order.OrderStatus.CANCELLED));

        AnalyticsDto.OrderStatusBreakdown statusBreakdown = AnalyticsDto.OrderStatusBreakdown.builder()
                .pending(pending.size())
                .confirmed(confirmed.size())
                .shipped(shipped.size())
                .delivered(delivered.size())
                .cancelled(cancelled.size())
                .build();

        return AnalyticsDto.builder()
                .dailyStats(dailyStats)
                .categorySales(categorySales)
                .topProducts(topProducts)
                .orderStatusBreakdown(statusBreakdown)
                .build();
    }

    private BigDecimal nullToZero(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private long nullToZero(Long value) {
        return value != null ? value : 0L;
    }
}
