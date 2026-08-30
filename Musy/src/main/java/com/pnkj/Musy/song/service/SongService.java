package com.pnkj.Musy.song.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pnkj.Musy.song.entity.Song;
import com.pnkj.Musy.song.repository.SongRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository repository;

    public Song createSong(Song song) {
        return repository.save(song);
    }

    public String deleteSong(Long song_id) {
        repository.deleteById(song_id);

        return "Song has been deleted";
    }

    public Song findSong(Long song_id) {
        return repository.findById(song_id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<Song> allSongs() {
        return repository.findAll();
    }

}
