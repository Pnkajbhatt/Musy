package com.pnkj.Musy.auth.dto;

public record LoginResDTO(
        String Token,
        String username,
        String message) {
}