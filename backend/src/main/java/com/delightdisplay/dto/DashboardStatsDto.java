package com.delightdisplay.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class DashboardStatsDto {
    private long totalUsers;
    private long totalOrders;
    private long totalProducts;
    private BigDecimal totalRevenue;
    private long ordersToday;
    private long ordersThisWeek;
    private long ordersThisMonth;
    private BigDecimal revenueToday;
    private BigDecimal revenueThisWeek;
    private BigDecimal revenueThisMonth;
    private long pendingOrders;
    private long shippedOrders;
    private long deliveredOrders;
}
