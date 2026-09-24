package in.pnkj.auth_service.controller;

import in.pnkj.auth_service.dto.*;
import in.pnkj.auth_service.service.AuthService;
import in.pnkj.auth_service.service.AuthService.AuthTokenResult;
import in.pnkj.auth_service.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final CookieUtil cookieUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseAuth<RegisterResDTO>> register(
            @Valid @RequestBody RegisterReqDTO registerDTO,
            HttpServletRequest httpRequest) {
        ApiResponseAuth<RegisterResDTO> response = ApiResponseAuth.Success(
                authService.register(registerDTO),
                "User has been created",
                httpRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseAuth<LoginResDTO>> login(
            @Valid @RequestBody LoginReqDTO loginReqDTO,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        AuthTokenResult result = authService.login(loginReqDTO);

        ResponseCookie accessCookie = cookieUtil.createAccessTokenCookie(result.accessToken());
        ResponseCookie refreshCookie = cookieUtil.createRefreshTokenCookie(result.refreshToken());

        httpResponse.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        LoginResDTO resDTO = new LoginResDTO(
                result.accessToken(),
                result.userId(),
                result.username(),
                result.role(),
                "User logged in successfully"
        );

        ApiResponseAuth<LoginResDTO> response = ApiResponseAuth.Success(
                resDTO,
                "Logged in as " + result.username(),
                httpRequest.getRequestURI());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponseAuth<UserProfileDTO>> refresh(
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        String rawRefreshToken = cookieUtil.extractRefreshToken(httpRequest)
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Refresh token cookie missing"));

        AuthTokenResult result = authService.refresh(rawRefreshToken);

        ResponseCookie accessCookie = cookieUtil.createAccessTokenCookie(result.accessToken());
        ResponseCookie refreshCookie = cookieUtil.createRefreshTokenCookie(result.refreshToken());

        httpResponse.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        UserProfileDTO profile = new UserProfileDTO(result.userId(), result.username(), result.role());
        ApiResponseAuth<UserProfileDTO> response = ApiResponseAuth.Success(
                profile,
                "Token refreshed successfully",
                httpRequest.getRequestURI());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        cookieUtil.extractRefreshToken(httpRequest).ifPresent(authService::logout);

        ResponseCookie cleanAccess = cookieUtil.cleanAccessTokenCookie();
        ResponseCookie cleanRefresh = cookieUtil.cleanRefreshTokenCookie();

        httpResponse.addHeader(HttpHeaders.SET_COOKIE, cleanAccess.toString());
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, cleanRefresh.toString());

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponseAuth<UserProfileDTO>> getCurrentUser(
            Authentication authentication,
            HttpServletRequest httpRequest) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserProfileDTO profile = authService.getCurrentUser(authentication.getName());
        ApiResponseAuth<UserProfileDTO> response = ApiResponseAuth.Success(
                profile,
                "Current user profile",
                httpRequest.getRequestURI());

        return ResponseEntity.ok(response);
    }
}
