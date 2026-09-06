package com.pnkj.Musy.auth.exceptions;

import com.pnkj.Musy.auth.dto.ApiErrorAuth;
import com.pnkj.Musy.auth.dto.ApiResponseAuth;
import com.pnkj.Musy.user.dto.*;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionhandlerAuth {

    public ResponseEntity<ApiResponseAuth<ApiError>> handleNotFound(ResourceNotFoundExceptionAuth ex,
            HttpServletRequest request) {

        ApiErrorAuth error = new ApiErrorAuth(ex.getCode(), ex.getMessage(), null);

        // ApiResponse<ApiError> response = ApiResponse.error("", error,
        // request.getRequestURI());

        ApiResponseAuth<ApiError> response = ApiResponseAuth.error(error.message(), error, null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

    }

}
