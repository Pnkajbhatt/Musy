package in.pnkj.like_service.repo;

import in.pnkj.like_service.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserIdAndSongId(Long userId, String songId);

    List<Like> findByUserId(Long userId);

    boolean existsByUserIdAndSongId(Long userId, String songId);

    long countBySongId(String songId);

    @Transactional
    void deleteByUserIdAndSongId(Long userId, String songId);
}
