package in.pnkj.auth_service.dto;

import java.util.List;

public record ApiErrorAuth(String code, String message, List<FieldError> fieldErrors) {
    public record FieldError(String field, String message) {
    }
}