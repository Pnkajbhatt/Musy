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

    public SongResponse createSong(SongRequest songRequest) {
        User user = userRepository.findById(songRequest.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Song song = dtoTSong(songRequest, user);
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

    public Song dtoTSong(SongRequest songRequest, User user) {

        Song song = new Song();
        song.setTitle(songRequest.title());
        song.setDescription(songRequest.description());
        song.setUser(user);
        song.setSong_url(songRequest.song_url());
        song.setCover_url(songRequest.cover_url());
        song.setGenre(songRequest.genre());
        return song;

    }
}
