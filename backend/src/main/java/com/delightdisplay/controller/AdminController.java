package com.delightdisplay.controller;

import com.delightdisplay.dto.*;
import com.delightdisplay.entity.Order;
import com.delightdisplay.entity.User;
import com.delightdisplay.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only endpoints")
public class AdminController {
    private final UserService userService;
    private final OrderService orderService;
    private final DashboardService dashboardService;

    // Dashboard
    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get analytics data for charts")
    public ResponseEntity<AnalyticsDto> getAnalytics(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(dashboardService.getAnalytics(days));
    }

    // User Management
    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<Page<UserDto>> getAllUsers(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "Update user")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Set user role")
    public ResponseEntity<UserDto> setUserRole(@PathVariable Long id, @RequestParam User.Role role) {
        return ResponseEntity.ok(userService.setUserRole(id, role));
    }

    @PatchMapping("/users/{id}/toggle-enabled")
    @Operation(summary = "Toggle user enabled status")
    public ResponseEntity<UserDto> toggleUserEnabled(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserEnabled(id));
    }

    // Order Management
    @GetMapping("/orders")
    @Operation(summary = "Get all orders")
    public ResponseEntity<Page<OrderDto>> getAllOrders(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @PatchMapping("/orders/{id}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable String id,
            @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
