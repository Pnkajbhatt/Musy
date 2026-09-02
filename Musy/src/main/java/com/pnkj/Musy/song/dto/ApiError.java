package com.pnkj.Musy.song.dto;

import java.util.List;

public record ApiError(String code, String message, List<FieldError> fieldErrors) {
    public record FieldError(String field, String message) {
    }
}