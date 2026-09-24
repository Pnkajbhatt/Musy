package in.pnkj.user_service.exceptions;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import in.pnkj.user_service.dto.ApiError;
import in.pnkj.user_service.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionhandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex,
            HttpServletRequest request) {
        ApiError error = new ApiError(ex.getCode(), ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(error.message(), error, request.getRequestURI()));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicate(DuplicateResourceException ex,
            HttpServletRequest request) {
        ApiError error = new ApiError(ex.getCode(), ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(error.message(), error, request.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        List<ApiError.FieldError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new ApiError.FieldError(error.getField(), error.getDefaultMessage()))
                .toList();
        ApiError error = new ApiError("VALIDATION_ERROR", "Invalid user data", fieldErrors);
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(error.message(), error, request.getRequestURI()));
    }
}
