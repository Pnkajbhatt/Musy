package com.pnkj.Musy.song.controller;

import java.util.List;

import org.apache.catalina.startup.RealmRuleSet;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pnkj.Musy.song.dto.ApiResponse;
import com.pnkj.Musy.song.dto.SongRequest;
import com.pnkj.Musy.song.dto.SongResponse;

import com.pnkj.Musy.song.service.SongService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SongController {

    private final SongService service;

    @PostMapping("/song")
    public ResponseEntity<ApiResponse<SongResponse>> createSong(@Valid @RequestBody SongRequest songRequest,
            HttpServletRequest httpServletRequest) {
        ApiResponse<SongResponse> response = ApiResponse.success(service.createSong(songRequest), "Song has been Saved",
                httpServletRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @DeleteMapping("/song/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSong(@PathVariable Long id, HttpServletRequest httpServletRequest) {
        service.deleteSong(id);
        ApiResponse<Void> response = ApiResponse.success(null, "Song has been deleted",
                httpServletRequest.getRequestURI());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/song/{id}")
    public ResponseEntity<ApiResponse<SongResponse>> findsong(@PathVariable Long id,
            HttpServletRequest httpServletRequest) {
        ApiResponse<SongResponse> response = ApiResponse.success(service.findSong(id), "User",
                httpServletRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.FOUND)
                .body(response);
    }

    @GetMapping("/songs")
    public ResponseEntity<ApiResponse<List<SongResponse>>> getAllSong(HttpServletRequest httpServletRequest) {
        ApiResponse<List<SongResponse>> response = ApiResponse.success(service.allSongs(), "User",
                httpServletRequest.getRequestURI());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
