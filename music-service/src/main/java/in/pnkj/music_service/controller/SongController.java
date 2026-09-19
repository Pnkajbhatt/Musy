package in.pnkj.music_service.controller;

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

import in.pnkj.music_service.dto.ApiResponseSONG;
import in.pnkj.music_service.dto.SongRequest;
import in.pnkj.music_service.dto.SongResponse;
import in.pnkj.music_service.service.S3Service;
import in.pnkj.music_service.service.SongService;
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
                        @RequestPart("file") MultipartFile file, @RequestPart("cover") MultipartFile cover,
                        HttpServletRequest httpServletRequest) throws IOException {
                String musicURL = s3Service.uploadMusic(file);
                String coverURL = s3Service.uploadCover(cover);
                ApiResponseSONG<SongResponse> response = ApiResponseSONG.success(
                                service.createSong(songRequest, musicURL, coverURL), "Song has been Saved",
                                httpServletRequest.getRequestURI());
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        @DeleteMapping("/song/{id}")
        public ResponseEntity<ApiResponseSONG<Void>> deleteSong(@PathVariable("id") Long songId,
                        HttpServletRequest httpServletRequest) {
                service.deleteSong(songId);
                ApiResponseSONG<Void> response = ApiResponseSONG.success(null, "Song has been deleted",
                                httpServletRequest.getRequestURI());
                return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        @GetMapping("/song/{id}")
        public ResponseEntity<ApiResponseSONG<SongResponse>> findsong(@PathVariable Long songId,
                        HttpServletRequest httpServletRequest) {
                ApiResponseSONG<SongResponse> response = ApiResponseSONG.success(service.findSong(songId), "User",
                                httpServletRequest.getRequestURI());

                return ResponseEntity.status(HttpStatus.FOUND).body(response);
        }

        @GetMapping({ "song", "songs" })
        public ResponseEntity<ApiResponseSONG<List<SongResponse>>> getAllSong(HttpServletRequest httpServletRequest) {
                ApiResponseSONG<List<SongResponse>> response = ApiResponseSONG.success(service.allSongs(), "User",
                                httpServletRequest.getRequestURI());

                return ResponseEntity.status(HttpStatus.OK).body(response);
        }

}
