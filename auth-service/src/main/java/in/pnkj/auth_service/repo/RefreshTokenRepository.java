package in.pnkj.auth_service.repo;

import in.pnkj.auth_service.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // Querying by token
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByTokenAndRevokedFalse(String token);

    List<RefreshToken> findByUserId(String userId);

    List<RefreshToken> findByUserIdAndRevokedFalse(String userId);

    // Deleting expired tokens
    @Transactional
    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.expiryDate <= :now")
    int deleteByExpiryDateBefore(@Param("now") Instant now);

    @Transactional
    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.expiryDate <= :now OR r.revoked = true")
    int deleteAllExpiredOrRevoked(@Param("now") Instant now);

    // Revoking user sessions
    @Transactional
    @Modifying
    @Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.userId = :userId AND r.revoked = false")
    int revokeAllUserTokens(@Param("userId") String userId);

    @Transactional
    @Modifying
    @Query("UPDATE RefreshToken r SET r.revoked = true WHERE r.token = :token")
    int revokeByToken(@Param("token") String token);

    @Transactional
    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.userId = :userId")
    int deleteAllByUserId(@Param("userId") String userId);
}
