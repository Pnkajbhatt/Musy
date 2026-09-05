package com.pnkj.Musy.song.exceptions;

import com.pnkj.Musy.song.dto.*;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionhandler {

    public ResponseEntity<ApiResponseSONG<ApiErrorSONG>> handleNotFound(ResourceNotFoundException ex,
            HttpServletRequest httpServletRequest) {
        ApiErrorSONG error = new ApiErrorSONG(ex.getCode(), ex.getMessage(), null);
        ApiResponseSONG<ApiErrorSONG> response = ApiResponseSONG.error(error, null);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

    }
}
