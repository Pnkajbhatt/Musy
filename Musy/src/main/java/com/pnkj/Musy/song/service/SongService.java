package com.pnkj.Musy.song.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pnkj.Musy.song.dto.SongRequest;
import com.pnkj.Musy.song.dto.SongResponse;
import com.pnkj.Musy.song.entity.Song;
import com.pnkj.Musy.song.repository.SongRepository;
import com.pnkj.Musy.user.entity.User;
import com.pnkj.Musy.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository repository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    public SongResponse createSong(SongRequest songRequest, String musicURL, String coverURL) {
        User user = userRepository.findById(songRequest.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Song song = dtoTSong(songRequest, user, musicURL, coverURL);
        song = repository.save(song);

        return toResponse(song);
    }

    public void deleteSong(Long songId) {
        Song song = repository.findById(songId)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        repository.delete(song);
    }

    public SongResponse findSong(Long songId) {
        return toResponse(
                repository.findById(songId)
                        .orElseThrow(() -> new IllegalArgumentException("Song not found")));
    }

    public List<SongResponse> allSongs() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    private SongResponse toResponse(Song song) {
        return SongResponse.from(song,
                s3Service.getFileUrl(song.getSongUrl()),
                s3Service.getFileUrl(song.getCoverUrl()));
    }

    public Song dtoTSong(SongRequest songRequest, User user, String SongURL, String CoverURL) {

        Song song = new Song();
        song.setTitle(songRequest.title());
        song.setDescription(songRequest.description());
        song.setUser(user);
        song.setCoverUrl(CoverURL);
        song.setGenre(songRequest.genre());
        song.setSongUrl(SongURL);
        return song;

    }
}
