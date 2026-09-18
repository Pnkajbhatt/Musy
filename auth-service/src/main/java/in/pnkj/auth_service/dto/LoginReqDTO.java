package in.pnkj.auth_service.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginReqDTO(
        @NotBlank String username,
        @NotBlank String password) {
}