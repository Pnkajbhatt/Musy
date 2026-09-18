package in.pnkj.user_service.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import in.pnkj.user_service.entity.Role;
import in.pnkj.user_service.entity.RoleType;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}