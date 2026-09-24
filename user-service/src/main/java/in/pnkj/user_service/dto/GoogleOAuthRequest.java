package in.pnkj.user_service.dto;

public record GoogleOAuthRequest(
        String email,
        String username,
        String providerId
) {
}
