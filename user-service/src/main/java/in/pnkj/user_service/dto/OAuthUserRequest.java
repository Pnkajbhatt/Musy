package in.pnkj.user_service.dto;

import in.pnkj.user_service.entity.AuthProvider;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OAuthUserRequest(
        @NotBlank @Email String email,
        String username,
        @NotNull AuthProvider provider,
        String providerId
) {
}
