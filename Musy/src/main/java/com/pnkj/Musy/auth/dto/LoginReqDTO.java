package com.pnkj.Musy.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginReqDTO(
        @NotBlank String username,
        @NotBlank String password) {
}