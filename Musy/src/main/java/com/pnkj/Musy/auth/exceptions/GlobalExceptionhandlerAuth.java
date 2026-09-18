package com.pnkj.Musy.auth.exceptions;

import com.pnkj.Musy.user.dto.*;

import in.pnkj.auth_service.dto.ApiErrorAuth;
import in.pnkj.auth_service.dto.ApiResponseAuth;
import in.pnkj.user_service.dto.ApiError;
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
