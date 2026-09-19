package in.pnkj.user_service.entity.dto;

public record AuthUserResponseDTO(Long userId, String username, String password, String role) {
}
