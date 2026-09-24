package in.pnkj.auth_service.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

@Component
public class CookieUtil {
    public static final String ACCESS_COOKIE_NAME = "musy_access_token";
    public static final String REFRESH_COOKIE_NAME = "musy_refresh_token";

    @Value("${app.cookie.secure:false}")
    private boolean isSecure;

    @Value("${app.cookie.same-site:Lax}")
    private String sameSite;

    @Value("${app.cookie.domain:}")
    private String domain;

    public ResponseCookie createAccessTokenCookie(String accessToken) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(ACCESS_COOKIE_NAME, accessToken)
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .maxAge(Duration.ofMinutes(15))
                .sameSite(sameSite);

        if (domain != null && !domain.isBlank()) {
            builder.domain(domain);
        }

        return builder.build();
    }

    public ResponseCookie cleanAccessTokenCookie() {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(ACCESS_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .maxAge(0)
                .sameSite(sameSite);

        if (domain != null && !domain.isBlank()) {
            builder.domain(domain);
        }

        return builder.build();
    }

    public ResponseCookie createRefreshTokenCookie(String refreshToken) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(REFRESH_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(isSecure)
                .path("/api/auth")
                .maxAge(Duration.ofDays(7))
                .sameSite(sameSite);

        if (domain != null && !domain.isBlank()) {
            builder.domain(domain);
        }

        return builder.build();
    }

    public ResponseCookie cleanRefreshTokenCookie() {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(REFRESH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(isSecure)
                .path("/api/auth")
                .maxAge(0)
                .sameSite(sameSite);

        if (domain != null && !domain.isBlank()) {
            builder.domain(domain);
        }

        return builder.build();
    }

    public Optional<String> extractAccessToken(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> ACCESS_COOKIE_NAME.equals(cookie.getName()) || "accessToken".equals(cookie.getName()))
                .map(jakarta.servlet.http.Cookie::getValue)
                .filter(val -> val != null && !val.isBlank())
                .findFirst();
    }

    public Optional<String> extractRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> REFRESH_COOKIE_NAME.equals(cookie.getName()) || "refreshToken".equals(cookie.getName()))
                .map(jakarta.servlet.http.Cookie::getValue)
                .filter(val -> val != null && !val.isBlank())
                .findFirst();
    }
}
