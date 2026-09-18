package in.pnkj.auth_service.dto;

public record CreateUserRequest(String username, String email, String password) {
}
