package in.pnkj.history_service.repo;

import in.pnkj.history_service.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {

    List<History> findByUserIdOrderByPlayedAtDesc(Long userId);

    @Transactional
    void deleteByUserId(Long userId);
}
