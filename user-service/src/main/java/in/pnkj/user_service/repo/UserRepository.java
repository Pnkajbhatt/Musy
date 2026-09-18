package in.pnkj.user_service.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import in.pnkj.user_service.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
