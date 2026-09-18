package in.pnkj.auth_service.dto;

public record LoginResDTO(
        String Token,
        String username,
        String message) {
}