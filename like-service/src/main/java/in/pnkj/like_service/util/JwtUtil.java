package in.pnkj.like_service.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    private final SecretKey secretKey;

    public JwtUtil(@Value("${spring.jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    /**
     * Extracts the userId claim from a Bearer token.
     *
     * @param bearerToken the raw Authorization header value (e.g. "Bearer eyJ...")
     * @return the userId stored in the token claims
     */
    public Long extractUserId(String bearerToken) {
        String token = bearerToken.startsWith("Bearer ") ? bearerToken.substring(7) : bearerToken;
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("userId", Long.class);
    }
}
