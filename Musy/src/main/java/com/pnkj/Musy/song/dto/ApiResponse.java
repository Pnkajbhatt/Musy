package com.pnkj.Musy.song.dto;

import java.time.Instant;

public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        ApiError error,
        Instant timestamp,
        String path) {
    public static <T> ApiResponse<T> success(T data, String message, String path) {
        return new ApiResponse<T>(true, message, data, null, Instant.now(), path);
    }

    public static <T> ApiResponse<T> error(ApiError error, String path) {
        return new ApiResponse<T>(false, error.message(), null, error, Instant.now(), path);
    }
}
