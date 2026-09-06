package com.pnkj.Musy.auth.dto;

import java.time.Instant;

public record ApiResponseAuth<T>(
        boolean success,
        String message,
        T data,
        ApiErrorAuth error,
        Instant timestamp,
        String path) {

    public static <T> ApiResponseAuth<T> Success(T data, String message, String path) {
        return new ApiResponseAuth<T>(true, message, data, null, Instant.now(), path);
    }

    public static <T> ApiResponseAuth<T> error(String message, ApiErrorAuth error, String path) {
        return new ApiResponseAuth<T>(false, message, null, error, Instant.now(), path);
    }
}
