package com.pnkj.Musy.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// @Getter
// @Setter
// public class UserRequest {

//     @NotBlank
//     @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
//     private String username;

//     @NotBlank(message = "Password is required")
//     @Size(min = 6, message = "Password must contain at least 6 characters")
//     private String password;

//     @NotBlank(message = "Email is required")
//     @Email(message = "Invalid email format")
//     private String email;

// }

public record UserRequest(
        @NotBlank @Size(min = 2, max = 50, message = "Name must be Between 2 and 50 characters") String username,
        @NotBlank @Size(min = 8, max = 16, message = "password must be Between 8 and 16 characters") String password,
        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email) {
}
