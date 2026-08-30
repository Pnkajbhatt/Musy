package com.pnkj.Musy.song.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pnkj.Musy.song.entity.Song;
import com.pnkj.Musy.song.service.SongService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SongController {

    private final SongService service;

    @PostMapping("/song")
    public Song createSong(@RequestBody Song song) {
        return service.createSong(song);
    }

    @DeleteMapping("/song/{id}")
    public Song deleteSong(@PathVariable Long id) {
        Song song = service.findSong(id);
        service.deleteSong(id);

        return song;
    }

    @GetMapping("/song/{id}")
    public Song findsong(@PathVariable Long id) {
        return service.findSong(id);
    }

    @GetMapping("/songs")
    public List<Song> getAllSong() {
        return service.allSongs();
    }

}
