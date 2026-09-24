package in.pnkj.auth_service.service;

import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import in.pnkj.auth_service.config.CustomUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private final SecretKey signedKey;
    private final long expirationMs;

    public JwtService(
            @Value("${spring.jwt.secret}") String secret,
            @Value("${spring.jwt.expiration-ms}") long expirationMs) {
        this.signedKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMs = expirationMs;
    }

    public String generateJwtToken(Authentication authentication) {
        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority != null && authority.startsWith("ROLE_"))
                .toList();
        Date issuedAt = new Date();
        var builder = Jwts.builder()
                .subject(authentication.getName())
                .claim("authorities", authorities);
        if (authentication.getPrincipal() instanceof CustomUserDetails details) {
            builder.claim("userId", details.getUserId());
        }
        return builder
                .issuedAt(issuedAt)
                .expiration(new Date(issuedAt.getTime() + expirationMs))
                .signWith(signedKey)
                .compact();
    }

    public String generateJwtToken(Long userId, String username, String role) {
        Date issuedAt = new Date();
        String formattedRole = (role != null && !role.startsWith("ROLE_")) ? "ROLE_" + role : role;

        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .claim("authorities", List.of(formattedRole != null ? formattedRole : "ROLE_USER"))
                .issuedAt(issuedAt)
                .expiration(new Date(issuedAt.getTime() + expirationMs))
                .signWith(signedKey)
                .compact();
    }

    public String generateAccessToken(String username, Long userId, String role) {
        return generateJwtToken(userId, username, role);
    }

    public String ExtractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, String username) {
        Claims claims = parseClaims(token);
        return username.equals(claims.getSubject()) && claims.getExpiration().after(new Date());
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signedKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


}
