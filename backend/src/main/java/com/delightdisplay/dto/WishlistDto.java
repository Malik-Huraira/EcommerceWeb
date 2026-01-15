package com.delightdisplay.dto;

import com.delightdisplay.entity.Wishlist;
import lombok.Data;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class WishlistDto {
    private String id;
    private List<ProductDto> items;

    public static WishlistDto fromEntity(Wishlist wishlist) {
        WishlistDto dto = new WishlistDto();
        dto.setId(String.valueOf(wishlist.getId()));
        dto.setItems(wishlist.getItems().stream()
                .map(item -> ProductDto.fromEntity(item.getProduct()))
                .collect(Collectors.toList()));
        return dto;
    }
}
