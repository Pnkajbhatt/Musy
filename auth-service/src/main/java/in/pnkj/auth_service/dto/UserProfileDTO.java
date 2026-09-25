package in.pnkj.auth_service.dto;

public record UserProfileDTO(
        Long userId,
        String username,
        String role,
        String token
) {
    public UserProfileDTO(Long userId, String username, String role) {
        this(userId, username, role, null);
    }
}
