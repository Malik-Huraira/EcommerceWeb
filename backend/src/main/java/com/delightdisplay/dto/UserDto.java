package com.delightdisplay.dto;

import com.delightdisplay.entity.User;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private String id;
    private String email;
    private String name;
    private String phone;
    private String address;
    private String avatar;
    private String role;
    private boolean enabled;
    private LocalDateTime createdAt;

    public static UserDto fromEntity(User user) {
        UserDto dto = new UserDto();
        dto.setId(String.valueOf(user.getId()));
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setAvatar(user.getAvatar());
        dto.setRole(user.getRole().name());
        dto.setEnabled(user.isEnabled());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
