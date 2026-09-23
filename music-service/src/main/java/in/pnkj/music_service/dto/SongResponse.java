package in.pnkj.music_service.dto;

import java.time.Instant;

import in.pnkj.music_service.entity.Genre;
import in.pnkj.music_service.entity.Song;

public record SongResponse(Long songId, String title, String songUrl, String coverUrl, String description,
        Long songLikes, Genre genre, Long streamCount, Instant createdAt, Long userId) {

    public static SongResponse from(Song entity, String songUrl, String coverUrl) {
        return new SongResponse(entity.getSongId(), entity.getTitle(), songUrl, coverUrl, entity.getDescription(),
                entity.getSongLike(), entity.getGenre(), entity.getStreamCount(), entity.getCreatedAt(), entity.getUserId());
    }
}