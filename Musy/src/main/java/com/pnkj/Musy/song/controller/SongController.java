package com.pnkj.Musy.song.controller;

import java.io.IOException;
import java.util.List;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pnkj.Musy.song.dto.ApiResponseSONG;
import com.pnkj.Musy.song.dto.SongRequest;
import com.pnkj.Musy.song.dto.SongResponse;
import com.pnkj.Musy.song.service.S3Service;
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
        private final S3Service s3Service;

        @PostMapping(value = "/song", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponseSONG<SongResponse>> createSong(
                        @Valid @RequestPart("songRequest") SongRequest songRequest,
                        @RequestPart("file") MultipartFile file,
                        HttpServletRequest httpServletRequest) throws IOException {

                String MusicURL = s3Service.uploadMusic(file);

                ApiResponseSONG<SongResponse> response = ApiResponseSONG.success(
                                service.createSong(songRequest, MusicURL),
                                "Song has been Saved",
                                httpServletRequest.getRequestURI());

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(response);
        }

        @DeleteMapping("/song/{id}")
        public ResponseEntity<ApiResponseSONG<Void>> deleteSong(@PathVariable Long id,
                        HttpServletRequest httpServletRequest) {
                service.deleteSong(id);
                ApiResponseSONG<Void> response = ApiResponseSONG.success(null, "Song has been deleted",
                                httpServletRequest.getRequestURI());
                return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        @GetMapping("/song/{id}")
        public ResponseEntity<ApiResponseSONG<SongResponse>> findsong(@PathVariable Long id,
                        HttpServletRequest httpServletRequest) {
                ApiResponseSONG<SongResponse> response = ApiResponseSONG.success(service.findSong(id), "User",
                                httpServletRequest.getRequestURI());

                return ResponseEntity.status(HttpStatus.FOUND)
                                .body(response);
        }

        @GetMapping("/songs")
        public ResponseEntity<ApiResponseSONG<List<SongResponse>>> getAllSong(HttpServletRequest httpServletRequest) {
                ApiResponseSONG<List<SongResponse>> response = ApiResponseSONG.success(service.allSongs(), "User",
                                httpServletRequest.getRequestURI());

                return ResponseEntity.status(HttpStatus.OK).body(response);
        }

}
