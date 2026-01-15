package com.delightdisplay.repository;

import com.delightdisplay.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
        List<Product> findByFeaturedTrue();

        List<Product> findByIsNewTrue();

        @Query("SELECT p FROM Product p WHERE " +
                        "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%'))) AND " +
                        "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
                        "(:categoryName IS NULL OR LOWER(p.category.name) = LOWER(CAST(:categoryName AS string))) AND "
                        +
                        "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
                        "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
                        "(:inStock IS NULL OR p.inStock = :inStock) AND " +
                        "(:featured IS NULL OR p.featured = :featured) AND " +
                        "(:isNew IS NULL OR p.isNew = :isNew)")
        Page<Product> findWithFilters(
                        @Param("name") String name,
                        @Param("categoryId") Long categoryId,
                        @Param("categoryName") String categoryName,
                        @Param("minPrice") BigDecimal minPrice,
                        @Param("maxPrice") BigDecimal maxPrice,
                        @Param("inStock") Boolean inStock,
                        @Param("featured") Boolean featured,
                        @Param("isNew") Boolean isNew,
                        Pageable pageable);
}
