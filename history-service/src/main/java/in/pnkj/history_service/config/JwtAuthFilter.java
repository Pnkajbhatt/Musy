package in.pnkj.history_service.config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import in.pnkj.history_service.*;
import in.pnkj.history_service.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = null;
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else if (request.getCookies() != null) {
            token = java.util.Arrays.stream(request.getCookies())
                    .filter(c -> "musy_access_token".equals(c.getName()) || "accessToken".equals(c.getName()))
                    .map(jakarta.servlet.http.Cookie::getValue)
                    .filter(val -> val != null && !val.isBlank())
                    .findFirst()
                    .orElse(null);
        }

        if (token == null || token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (jwtService.isTokenValid(token)) {
                String username = jwtService.extractUsername(token);
                List<String> authorities = jwtService.extractAuthorities(token);
                List<SimpleGrantedAuthority> grantedAuthorities = new java.util.ArrayList<>();
                if (authorities != null) {
                    for (String authority : authorities) {
                        if (authority != null && !authority.isBlank()) {
                            grantedAuthorities.add(new SimpleGrantedAuthority(authority));
                            if (!authority.startsWith("ROLE_")) {
                                grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + authority));
                            } else {
                                grantedAuthorities.add(new SimpleGrantedAuthority(authority.substring(5)));
                            }
                        }
                    }
                }

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username,
                        null, grantedAuthorities);

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
        }
        filterChain.doFilter(request, response);
    }
}
