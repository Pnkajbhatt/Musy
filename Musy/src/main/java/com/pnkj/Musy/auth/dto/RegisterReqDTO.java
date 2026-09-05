package com.pnkj.Musy.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterReqDTO(
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank @Email String email) {
}