package com.pnkj.Musy.song.controller;

import java.io.IOException;
import java.io.InputStream;
import org.springframework.http.MediaType;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pnkj.Musy.song.dto.ApiResponseSONG;
import com.pnkj.Musy.song.service.S3Service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/files")
public class S3Controller {
    private final S3Service s3Services;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponseSONG<String>> upload(@RequestParam("file") MultipartFile file,
            HttpServletRequest request) throws IOException {
        ApiResponseSONG<String> response = ApiResponseSONG.success(s3Services.uploadMusic(file),
                "file has been uploaded",
                request.getRequestURI());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> download(
            @RequestParam String fileName) throws IOException {

        InputStream inputStream = s3Services.Download(fileName);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(inputStream));
    }

}
