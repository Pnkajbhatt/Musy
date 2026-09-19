package in.pnkj.music_service.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import in.pnkj.music_service.entity.Song;

public interface SongRepository extends JpaRepository<Song, Long> {
}
