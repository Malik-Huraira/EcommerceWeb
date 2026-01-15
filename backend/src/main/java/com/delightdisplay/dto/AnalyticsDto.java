package com.delightdisplay.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AnalyticsDto {
    private List<DailyStats> dailyStats;
    private List<CategorySales> categorySales;
    private List<TopProduct> topProducts;
    private OrderStatusBreakdown orderStatusBreakdown;

    @Data
    @Builder
    public static class DailyStats {
        private String date;
        private long orders;
        private BigDecimal revenue;
    }

    @Data
    @Builder
    public static class CategorySales {
        private String category;
        private long orders;
        private BigDecimal revenue;
    }

    @Data
    @Builder
    public static class TopProduct {
        private String name;
        private long sold;
    }

    @Data
    @Builder
    public static class OrderStatusBreakdown {
        private long pending;
        private long confirmed;
        private long shipped;
        private long delivered;
        private long cancelled;
    }
}
