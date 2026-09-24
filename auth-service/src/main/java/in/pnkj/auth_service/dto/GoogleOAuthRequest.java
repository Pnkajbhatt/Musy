package in.pnkj.auth_service.dto;

public record GoogleOAuthRequest(
        String email,
        String username,
        String providerId
) {
}
