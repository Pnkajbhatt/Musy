package com.pnkj.Musy.song.exceptions;

import com.pnkj.Musy.song.dto.*;

import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionhandlerSong {

    public ResponseEntity<ApiResponseSONG<ApiErrorSONG>> handleNotFound(ResourceNotFoundExceptionSong ex,
            HttpServletRequest httpServletRequest) {
        ApiErrorSONG error = new ApiErrorSONG(ex.getCode(), ex.getMessage(), null);
        ApiResponseSONG<ApiErrorSONG> response = ApiResponseSONG.error(error, null);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

    }

    public ResponseEntity<ApiResponseSONG<ApiErrorSONG>> handleIOException(IOException ex,
            HttpServletRequest httpServletRequest) {

        ApiErrorSONG error = new ApiErrorSONG(
                "FILE_UPLOAD_ERROR",
                "Unable to upload file",
                null);
        ApiResponseSONG<ApiErrorSONG> response = ApiResponseSONG.error(error, httpServletRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

    }
}
