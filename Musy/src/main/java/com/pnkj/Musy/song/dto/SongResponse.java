package com.pnkj.Musy.song.dto;

import java.time.Instant;

import com.pnkj.Musy.song.entity.Genre;
import com.pnkj.Musy.song.entity.Song;

public record SongResponse(
        Long SongId,
        Long userId,
        String title,
        String songUrl,
        String coverUrl,
        String description,
        Long songLikes,
        Genre genre,
        Long streamCount,
        Instant createdAt) {

    // public static SongResponse from(Song entity) {
    // return new SongResponse(
    // entity.getSong_id(),
    // entity.getUser().getUser_id(),
    // entity.getTitle(),
    // entity.getSong_url(),
    // entity.getCover_url(),
    // entity.getDescription(),
    // entity.getSongLike(),
    // entity.getGenre(),
    // entity.getStream_count(),

    // entity.getCreated_At());
    // }

    public static SongResponse from(Song entity, String songUrl, String coverUrl) {
        return new SongResponse(
                entity.getSongId(),
                entity.getUser().getUserId(),
                entity.getTitle(),
                songUrl,
                coverUrl,
                entity.getDescription(),
                entity.getSongLike(),
                entity.getGenre(),
                entity.getStreamCount(),
                entity.getCreatedAt());
    }
}