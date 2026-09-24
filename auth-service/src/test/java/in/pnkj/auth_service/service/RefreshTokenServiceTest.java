package in.pnkj.auth_service.service;

import in.pnkj.auth_service.entity.RefreshToken;
import in.pnkj.auth_service.repo.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private RefreshToken activeToken;

    @BeforeEach
    void setUp() {
        activeToken = RefreshToken.builder()
                .id(1L)
                .token("sample-token-uuid")
                .userId("101")
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .revoked(false)
                .createdAt(Instant.now())
                .build();
    }

    @Test
    void testCreateRefreshToken() {
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String token = refreshTokenService.createRefreshToken("101");

        assertNotNull(token);
        assertFalse(token.isBlank());

        ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(captor.capture());

        RefreshToken saved = captor.getValue();
        assertEquals("101", saved.getUserId());
        assertEquals(token, saved.getToken());
        assertFalse(saved.isRevoked());
        assertTrue(saved.getExpiryDate().isAfter(Instant.now()));
    }

    @Test
    void testFindByToken() {
        when(refreshTokenRepository.findByToken("sample-token-uuid")).thenReturn(Optional.of(activeToken));

        Optional<RefreshToken> result = refreshTokenService.findByToken("sample-token-uuid");

        assertTrue(result.isPresent());
        assertEquals("sample-token-uuid", result.get().getToken());
    }

    @Test
    void testIsTokenValid_Active() {
        assertTrue(refreshTokenService.isTokenValid(activeToken));
    }

    @Test
    void testIsTokenValid_Revoked() {
        activeToken.setRevoked(true);
        assertFalse(refreshTokenService.isTokenValid(activeToken));
    }

    @Test
    void testIsTokenValid_Expired() {
        activeToken.setExpiryDate(Instant.now().minus(1, ChronoUnit.DAYS));
        assertFalse(refreshTokenService.isTokenValid(activeToken));
    }

    @Test
    void testRevokeUserTokens() {
        when(refreshTokenRepository.revokeAllUserTokens("101")).thenReturn(2);

        int count = refreshTokenService.revokeUserTokens("101");

        assertEquals(2, count);
        verify(refreshTokenRepository).revokeAllUserTokens("101");
    }

    @Test
    void testRevokeToken() {
        when(refreshTokenRepository.revokeByToken("sample-token-uuid")).thenReturn(1);

        int count = refreshTokenService.revokeToken("sample-token-uuid");

        assertEquals(1, count);
        verify(refreshTokenRepository).revokeByToken("sample-token-uuid");
    }

    @Test
    void testDeleteExpiredTokens() {
        when(refreshTokenRepository.deleteAllExpiredOrRevoked(any(Instant.class))).thenReturn(5);

        int deleted = refreshTokenService.deleteExpiredTokens();

        assertEquals(5, deleted);
        verify(refreshTokenRepository).deleteAllExpiredOrRevoked(any(Instant.class));
    }
}
