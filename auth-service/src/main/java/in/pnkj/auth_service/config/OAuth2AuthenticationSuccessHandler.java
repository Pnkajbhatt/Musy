package in.pnkj.auth_service.config;

import in.pnkj.auth_service.apiClient.UserServiceClient;
import in.pnkj.auth_service.dto.AuthUserDTO;
import in.pnkj.auth_service.dto.GoogleOAuthRequest;
import in.pnkj.auth_service.service.JwtService;
import in.pnkj.auth_service.service.RefreshTokenService;
import in.pnkj.auth_service.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserServiceClient userServiceClient;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final CookieUtil cookieUtil;

    @Value("${app.oauth2.redirect-uri:https://musy-pnkj.duckdns.org/}")
    private String frontendRedirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");

        if (providerId == null && oAuth2User.getAttribute("id") != null) {
            providerId = String.valueOf(oAuth2User.getAttribute("id"));
        }

        if (name == null || name.isBlank()) {
            name = oAuth2User.getAttribute("login");
        }

        GoogleOAuthRequest oAuthRequest = new GoogleOAuthRequest(email, name, providerId);
        AuthUserDTO authUser = userServiceClient.findOrCreateGoogleUser(oAuthRequest);

        String accessToken = jwtService.generateAccessToken(
                authUser.username(),
                authUser.userId(),
                authUser.role()
        );
        String refreshToken = refreshTokenService.createRefreshToken(authUser.userId().toString());

        ResponseCookie accessCookie = cookieUtil.createAccessTokenCookie(accessToken);
        ResponseCookie refreshCookie = cookieUtil.createRefreshTokenCookie(refreshToken);

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        log.info("OAuth2 login successful for user {}, redirecting to {}", authUser.username(), frontendRedirectUri);
        getRedirectStrategy().sendRedirect(request, response, frontendRedirectUri);
    }
}
