package com.pnkj.Musy.user.exceptions;

import com.pnkj.Musy.user.dto.*;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionhandler {

    public ResponseEntity<ApiResponse<ApiError>> handleNotFound(ResourceNotFoundException ex,
            HttpServletRequest request) {

        ApiError error = new ApiError(ex.getCode(), ex.getMessage(), null);

        // ApiResponse<ApiError> response = ApiResponse.error("", error,
        // request.getRequestURI());

        ApiResponse<ApiError> response = ApiResponse.error(error.message(), error, null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

    }

}
