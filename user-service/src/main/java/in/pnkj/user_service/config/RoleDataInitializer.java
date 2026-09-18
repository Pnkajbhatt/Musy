package in.pnkj.user_service.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import in.pnkj.user_service.entity.Role;
import in.pnkj.user_service.entity.RoleType;
import in.pnkj.user_service.repo.RoleRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RoleDataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        saveIfMissing(1L, RoleType.ADMIN);
        saveIfMissing(2L, RoleType.USER);
        saveIfMissing(3L, RoleType.ARTIST);
    }

    private void saveIfMissing(Long id, RoleType type) {
        if (roleRepository.findByName(type).isEmpty()) {
            roleRepository.save(new Role(id, type));
        }
    }
}
