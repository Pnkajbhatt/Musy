package in.pnkj.user_service.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import in.pnkj.user_service.entity.ArtistApplications;

public interface ArtistApplicationRepository extends JpaRepository<ArtistApplications, Long> {

}
