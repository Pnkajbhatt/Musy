package in.pnkj.like_service.service;

import in.pnkj.like_service.dto.LikeResponse;
import in.pnkj.like_service.entity.Like;
import in.pnkj.like_service.repo.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;

    public LikeResponse likeSong(Long userId, String songId) {
        if (likeRepository.existsByUserIdAndSongId(userId, songId)) {
            throw new IllegalStateException("Song already liked");
        }
        Like like = Like.builder()
                .userId(userId)
                .songId(songId)
                .build();
        like = likeRepository.save(like);
        return toResponse(like);
    }

    @Transactional
    public void unlikeSong(Long userId, String songId) {
        likeRepository.deleteByUserIdAndSongId(userId, songId);
    }

    public List<LikeResponse> getLikedSongs(Long userId) {
        return likeRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public boolean isLiked(Long userId, String songId) {
        return likeRepository.existsByUserIdAndSongId(userId, songId);
    }

    public long getLikeCount(String songId) {
        return likeRepository.countBySongId(songId);
    }

    private LikeResponse toResponse(Like like) {
        return LikeResponse.builder()
                .id(like.getId())
                .songId(like.getSongId())
                .likedAt(like.getLikedAt())
                .build();
    }
}
