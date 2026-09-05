package com.pnkj.Musy.song.dto;

import java.util.List;

public record ApiErrorSONG(String code, String message, List<FieldError> fieldErrors) {
    public record FieldError(String field, String message) {
    }
}