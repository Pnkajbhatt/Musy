package in.pnkj.auth_service.dto;

public record LoginResDTO(
        String Token,
        Long userId,
        String username,
        String role,
        String message) {

    public LoginResDTO(String token, String username, String message) {
        this(token, null, username, null, message);
    }
}