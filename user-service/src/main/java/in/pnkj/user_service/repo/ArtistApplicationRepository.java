package in.pnkj.user_service.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import in.pnkj.user_service.entity.ApplicationStatus;
import in.pnkj.user_service.entity.ArtistApplications;
import in.pnkj.user_service.entity.User;

public interface ArtistApplicationRepository extends JpaRepository<ArtistApplications, Long> {
    Optional<ArtistApplications> findTopByUserOrderByCreatedAtDesc(User user);
    Optional<ArtistApplications> findByUser(User user);
    List<ArtistApplications> findByApplicationStatus(ApplicationStatus status);
}
