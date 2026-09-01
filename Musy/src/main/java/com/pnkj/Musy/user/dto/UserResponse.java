package com.pnkj.Musy.user.dto;

import com.pnkj.Musy.user.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// import com.pnkj.Musy.user.entity.Role;

// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.Setter;

// @Getter
// @Setter
// @NoArgsConstructor
// public class UserResponse {
// private Long id;
// private String username;
// private String email;
// private Role role;
// }

public record UserResponse(
        @NotNull Long id,
        @NotBlank String username,
        @Email String email,
        @NotBlank Role role) {

}