package in.pnkj.auth_service.exceptions;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import feign.FeignException;
import in.pnkj.auth_service.dto.ApiErrorAuth;
import in.pnkj.auth_service.dto.ApiResponseAuth;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandlerAuth {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseAuth<Void>> handleValidation(MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        List<ApiErrorAuth.FieldError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new ApiErrorAuth.FieldError(error.getField(), error.getDefaultMessage()))
                .toList();
        ApiErrorAuth error = new ApiErrorAuth("VALIDATION_ERROR", "Invalid request data", fieldErrors);
        return ResponseEntity.badRequest()
                .body(ApiResponseAuth.error(error.message(), error, request.getRequestURI()));
    }

    @ExceptionHandler({ BadCredentialsException.class, UsernameNotFoundException.class })
    public ResponseEntity<ApiResponseAuth<Void>> handleBadCredentials(RuntimeException ex,
            HttpServletRequest request) {
        ApiErrorAuth error = new ApiErrorAuth("BAD_CREDENTIALS", "Invalid username or password", null);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponseAuth.error(error.message(), error, request.getRequestURI()));
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ApiResponseAuth<Void>> handleFeign(FeignException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.resolve(ex.status());
        if (status == null) {
            status = HttpStatus.BAD_GATEWAY;
        }
        String message = ex.contentUTF8().isBlank() ? "User service request failed" : ex.contentUTF8();
        ApiErrorAuth error = new ApiErrorAuth("USER_SERVICE_ERROR", message, null);
        return ResponseEntity.status(status)
                .body(ApiResponseAuth.error("Auth request failed", error, request.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseAuth<Void>> handleGeneric(Exception ex, HttpServletRequest request) {
        ApiErrorAuth error = new ApiErrorAuth("INTERNAL_ERROR", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponseAuth.error("Auth request failed", error, request.getRequestURI()));
    }
}
