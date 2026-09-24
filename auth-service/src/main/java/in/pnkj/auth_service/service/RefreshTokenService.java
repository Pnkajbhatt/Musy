package in.pnkj.auth_service.service;

import in.pnkj.auth_service.entity.RefreshToken;
import in.pnkj.auth_service.repo.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public String createRefreshToken(String userId) {
        String rawToken = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .token(rawToken)
                .userId(userId)
                .expiryDate(Instant.now().plus(Duration.ofDays(7)))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public boolean isTokenValid(RefreshToken refreshToken) {
        return refreshToken != null && !refreshToken.isRevoked() && refreshToken.getExpiryDate().isAfter(Instant.now());
    }

    @Transactional
    public Optional<RefreshToken> rotateRefreshToken(String oldRawToken) {
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(oldRawToken);
        if (tokenOpt.isEmpty()) {
            return Optional.empty();
        }

        RefreshToken oldToken = tokenOpt.get();
        if (oldToken.isRevoked()) {
            // Potential token reuse / compromise: revoke all active sessions for this user
            refreshTokenRepository.revokeAllUserTokens(oldToken.getUserId());
            return Optional.empty();
        }

        if (oldToken.getExpiryDate().isBefore(Instant.now())) {
            return Optional.empty();
        }

        // Revoke the used token
        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        // Issue and return new token
        String newRawToken = createRefreshToken(oldToken.getUserId());
        return refreshTokenRepository.findByToken(newRawToken);
    }

    @Transactional
    public int revokeUserTokens(String userId) {
        return refreshTokenRepository.revokeAllUserTokens(userId);
    }

    @Transactional
    public int revokeToken(String token) {
        return refreshTokenRepository.revokeByToken(token);
    }

    @Transactional
    public int deleteExpiredTokens() {
        return refreshTokenRepository.deleteAllExpiredOrRevoked(Instant.now());
    }
}
