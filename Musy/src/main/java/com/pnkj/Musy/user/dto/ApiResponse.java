package com.pnkj.Musy.user.dto;

import java.time.Instant;

public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        ApiError error,
        Instant timestamp,
        String path) {

    public static <T> ApiResponse<T> Success(T data, String message, String path) {
        return new ApiResponse<T>(true, message, data, null, Instant.now(), path);
    }

    public static <T> ApiResponse<T> error(String message, ApiError error, String path) {
        return new ApiResponse<T>(false, message, null, error, Instant.now(), path);
    }
}
