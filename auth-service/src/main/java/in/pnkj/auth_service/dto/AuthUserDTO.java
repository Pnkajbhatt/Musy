package in.pnkj.auth_service.dto;

public record AuthUserDTO(Long userId, String username, String password, String role) {
}
