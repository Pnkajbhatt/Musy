package com.pnkj.Musy.song.dto;

import java.time.Instant;

import com.pnkj.Musy.song.entity.Genre;
import com.pnkj.Musy.song.entity.Song;

public record SongResponse(
        Long songId,
        Long userId,
        String title,
        String songUrl,
        String coverUrl,
        String description,
        Genre genre,
        Long streamCount,
        Instant createdAt) {

    public static SongResponse from(Song entity) {
        return new SongResponse(
                entity.getSong_id(),
                entity.getUser().getUser_id(),
                entity.getTitle(),
                entity.getSong_url(),
                entity.getCover_url(),
                entity.getDescription(),
                entity.getGenre(),
                entity.getStream_count(),
                entity.getCreated_At());
    }
}