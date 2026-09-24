package in.pnkj.auth_service.dto;

public record UserProfileDTO(
        Long userId,
        String username,
        String role
) {
}
