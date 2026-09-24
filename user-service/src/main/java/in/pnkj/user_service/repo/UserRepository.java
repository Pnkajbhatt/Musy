package in.pnkj.user_service.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import in.pnkj.user_service.entity.AuthProvider;
import in.pnkj.user_service.entity.RoleType;
import in.pnkj.user_service.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    long countByRole_Name(RoleType roleType);

    Optional<User> findByAuthProviderAndProviderId(AuthProvider authProvider, String providerId);

    Optional<User> findByAuthProviderAndEmail(AuthProvider authProvider, String email);

    Optional<User> findByEmailAndAuthProvider(String email, AuthProvider authProvider);

    List<User> findByRole_Name(RoleType roleType);
}
