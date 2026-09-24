package in.pnkj.user_service.dto;

import in.pnkj.user_service.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record UserResponse(
        @NotNull Long UserId,
        @NotBlank String username,
        @Email String email,
        @NotBlank Role role) {

}