package com.pnkj.Musy.song.dto;

import java.time.Instant;

public record ApiResponseSONG<T>(
        boolean success,
        String message,
        T data,
        ApiErrorSONG error,
        Instant timestamp,
        String path) {
    public static <T> ApiResponseSONG<T> success(T data, String message, String path) {
        return new ApiResponseSONG<T>(true, message, data, null, Instant.now(), path);
    }

    public static <T> ApiResponseSONG<T> error(ApiErrorSONG error, String path) {
        return new ApiResponseSONG<T>(false, error.message(), null, error, Instant.now(), path);
    }
}
