package in.pnkj.history_service.service;

import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private final SecretKey signedKey;

    public JwtService(@Value("${spring.jwt.secret}") String secret) {
        this.signedKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            return parseClaims(token).getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public Claims parseClaims(String token) {
        return Jwts.parser().verifyWith(signedKey).build().parseSignedClaims(token).getPayload();
    }

    public Long extractUserId(String token) {
        Object val = parseClaims(token).get("userId");
        if (val instanceof Number n) {
            return n.longValue();
        } else if (val != null) {
            return Long.parseLong(val.toString());
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    public List<String> extractAuthorities(String token) {
        List<String> authorities = (List<String>) parseClaims(token).get("authorities");
        return authorities == null ? List.of() : authorities;
    }
}
