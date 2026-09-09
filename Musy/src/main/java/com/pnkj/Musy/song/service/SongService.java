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

    public SongResponse createSong(SongRequest songRequest, String musicURL, String coverURL) {
        User user = userRepository.findById(songRequest.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Song song = dtoTSong(songRequest, user, musicURL, coverURL);
        song = repository.save(song);

        return SongResponse.from(song);
    }

    public void deleteSong(Long songId) {
        Song song = repository.findById(songId)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        repository.delete(song);
    }

    public SongResponse findSong(Long songId) {
        return SongResponse.from(
                repository.findById(songId)
                        .orElseThrow(() -> new IllegalArgumentException("Song not found")));
    }

    public List<SongResponse> allSongs() {
        return repository.findAll().stream().map(song -> SongResponse.from(song)).toList();
    }

    public Song dtoTSong(SongRequest songRequest, User user, String SongURL, String CoverURL) {

        Song song = new Song();
        song.setTitle(songRequest.title());
        song.setDescription(songRequest.description());
        song.setUser(user);
        song.setCover_url(CoverURL);
        song.setGenre(songRequest.genre());
        song.setSong_url(SongURL);
        return song;

    }
}
