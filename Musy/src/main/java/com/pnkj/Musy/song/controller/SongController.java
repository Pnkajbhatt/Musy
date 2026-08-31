package com.pnkj.Musy.song.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pnkj.Musy.song.dto.SongRequest;
import com.pnkj.Musy.song.dto.SongResponse;

import com.pnkj.Musy.song.service.SongService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SongController {

    private final SongService service;

    @PostMapping("/song")
    public ResponseEntity<SongResponse> createSong(@Valid @RequestBody SongRequest songRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createSong(songRequest));
    }

    @GetMapping("/song/{id}")
    public SongResponse findsong(@PathVariable Long id) {
        return service.findSong(id);
    }

    @GetMapping("/songs")
    public ResponseEntity<List<SongResponse>> getAllSong() {
        return ResponseEntity.ok().body(service.allSongs());
    }

}
