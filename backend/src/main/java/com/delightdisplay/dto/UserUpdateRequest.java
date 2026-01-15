package com.delightdisplay.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @Email(message = "Invalid email format")
    private String email;
    private String name;
    private String phone;
    private String address;
    private String avatar;
    private String password;
}
