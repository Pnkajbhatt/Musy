package com.pnkj.Musy.song.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pnkj.Musy.song.config.S3Config;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Config s3Config;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public String uploadMusic(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        if (!isSupportedAudio(file.getOriginalFilename())) {
            throw new IllegalArgumentException(
                    "Only MP3, WAV, FLAC and AAC files are allowed");
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        PutObjectRequest request = PutObjectRequest.builder().bucket(bucketName).key(fileName)
                .contentType(file.getContentType()).build();

        s3Config.s3Client().putObject(request, RequestBody.fromBytes(file.getBytes()));

        return fileName;
    }

    public InputStream Download(String fileName) throws IOException {

        GetObjectRequest req = GetObjectRequest.builder()
                .bucket(bucketName).key(fileName).build();

        return s3Config.s3Client().getObject(req);
    }

    private boolean isSupportedAudio(String fileName) {
        String name = fileName.toLowerCase();

        return name.endsWith(".mp3")
                || name.endsWith(".wav")
                || name.endsWith(".flac")
                || name.endsWith(".aac");
    }

}
