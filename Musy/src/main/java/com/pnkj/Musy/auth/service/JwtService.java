package com.pnkj.Musy.auth.service;

import java.security.Key;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

public class JwtService {
    @Value("${jwt.secret}")
    String secrete;
    @Value("${jwt.expiration-ms}")
    long expirationMs;

    SecretKey signedKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secrete));

    public String GenerateJwtToken(Authentication authentication) {
        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        Date issuedAt = new Date();
        return Jwts.builder()
                .subject(authentication.getName())
                .claim("authorities", authorities)
                .issuedAt(issuedAt)
                .expiration(new Date(issuedAt.getTime() + expirationMs))
                .signWith(signedKey)
                .compact();
    }

    public String ExtractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, String username) {
        Claims claims = parseClaims(token);
        return username.equals(claims.getSubject()) && claims.getExpiration().after(new Date());
    }

    public Claims parseClaims(String Token) {
        return Jwts.parser()
                .verifyWith(signedKey)
                .build()
                .parseSignedClaims(Token)
                .getPayload();

    }
}
