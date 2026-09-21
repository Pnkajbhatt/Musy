package in.pnkj.history_service.service;

import in.pnkj.history_service.dto.HistoryResponse;
import in.pnkj.history_service.entity.History;
import in.pnkj.history_service.repo.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    /** Record a play event for the given user and song. */
    public HistoryResponse recordPlay(Long userId, String songId) {
        History history = History.builder()
                .userId(userId)
                .songId(songId)
                .build();
        history = historyRepository.save(history);
        return toResponse(history);
    }

    /** Retrieve all play events for a user, newest first. */
    public List<HistoryResponse> getUserHistory(Long userId) {
        return historyRepository.findByUserIdOrderByPlayedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Clear the entire play history for a user. */
    @Transactional
    public void clearHistory(Long userId) {
        historyRepository.deleteByUserId(userId);
    }

    private HistoryResponse toResponse(History history) {
        return HistoryResponse.builder()
                .id(history.getId())
                .songId(history.getSongId())
                .playedAt(history.getPlayedAt())
                .build();
    }
}
