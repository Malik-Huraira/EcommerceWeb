package com.delightdisplay.repository;

import com.delightdisplay.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
        @Query("SELECT o FROM Order o JOIN FETCH o.user WHERE o.user.id = :userId")
        Page<Order> findByUserIdWithUser(Long userId, Pageable pageable);

        Page<Order> findByUserId(Long userId, Pageable pageable);

        @Query("SELECT o FROM Order o JOIN FETCH o.user")
        List<Order> findAllWithUser();

        @Query("SELECT o FROM Order o JOIN FETCH o.user WHERE o.id = :id")
        Optional<Order> findByIdWithUser(Long id);

        @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'COMPLETED'")
        BigDecimal getTotalRevenue();

        @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
        Long countOrdersSince(LocalDateTime startDate);

        @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'COMPLETED' AND o.createdAt >= :startDate")
        BigDecimal getRevenueSince(LocalDateTime startDate);

        List<Order> findByStatusIn(List<Order.OrderStatus> statuses);

        // Analytics queries
        @Query("SELECT FUNCTION('DATE', o.createdAt) as date, COUNT(o) as count, COALESCE(SUM(o.totalAmount), 0) as revenue "
                        +
                        "FROM Order o WHERE o.createdAt >= :startDate GROUP BY FUNCTION('DATE', o.createdAt) ORDER BY date")
        List<Object[]> getDailyOrderStats(LocalDateTime startDate);

        @Query("SELECT c.name, COUNT(oi) as count, COALESCE(SUM(oi.price * oi.quantity), 0) as revenue " +
                        "FROM OrderItem oi JOIN oi.product p JOIN p.category c " +
                        "WHERE oi.order.createdAt >= :startDate GROUP BY c.name ORDER BY revenue DESC")
        List<Object[]> getSalesByCategory(LocalDateTime startDate);

        @Query("SELECT p.name, SUM(oi.quantity) as totalSold " +
                        "FROM OrderItem oi JOIN oi.product p " +
                        "WHERE oi.order.createdAt >= :startDate GROUP BY p.id, p.name ORDER BY totalSold DESC")
        List<Object[]> getTopSellingProducts(LocalDateTime startDate, Pageable pageable);
}
