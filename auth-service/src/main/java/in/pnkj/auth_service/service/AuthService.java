package in.pnkj.auth_service.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import in.pnkj.auth_service.apiClient.UserServiceClient;
import in.pnkj.auth_service.config.CustomUserDetails;
import in.pnkj.auth_service.dto.*;
import in.pnkj.auth_service.entity.RefreshToken;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserServiceClient userServiceClient;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public record AuthTokenResult(
            String accessToken,
            String refreshToken,
            Long userId,
            String username,
            String role
    ) {}

    public RegisterResDTO register(RegisterReqDTO req) {
        UserResponseDTO user = userServiceClient
                .createUser(new CreateUserRequest(req.username(), req.email(), req.password()));

        return new RegisterResDTO(user.userId(), user.username());
    }

    public AuthTokenResult login(LoginReqDTO loginReqDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginReqDTO.username(), loginReqDTO.password()));

        String username = authentication.getName();
        Long userId = null;
        String role = "ROLE_USER";

        if (authentication.getPrincipal() instanceof CustomUserDetails details) {
            userId = details.getUserId();
            role = details.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .findFirst()
                    .orElse("ROLE_USER");
        } else {
            AuthUserDTO authUser = userServiceClient.getUserByUsername(username);
            userId = authUser.userId();
            role = authUser.role();
        }

        String accessToken = jwtService.generateAccessToken(username, userId, role);
        String refreshToken = refreshTokenService.createRefreshToken(String.valueOf(userId));

        return new AuthTokenResult(accessToken, refreshToken, userId, username, role);
    }

    public AuthTokenResult refresh(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new BadCredentialsException("Refresh token is required");
        }

        Optional<RefreshToken> rotatedOpt = refreshTokenService.rotateRefreshToken(rawRefreshToken);
        if (rotatedOpt.isEmpty()) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        RefreshToken newRefreshToken = rotatedOpt.get();
        Long userId = Long.parseLong(newRefreshToken.getUserId());
        AuthUserDTO authUser = userServiceClient.getUserById(userId);

        String newAccessToken = jwtService.generateAccessToken(authUser.username(), authUser.userId(), authUser.role());
        return new AuthTokenResult(newAccessToken, newRefreshToken.getToken(), authUser.userId(), authUser.username(), authUser.role());
    }

    public void logout(String rawRefreshToken) {
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            refreshTokenService.revokeToken(rawRefreshToken);
        }
    }

    public UserProfileDTO getCurrentUser(String username) {
        AuthUserDTO user = userServiceClient.getUserByUsername(username);
        return new UserProfileDTO(user.userId(), user.username(), user.role());
    }
}
