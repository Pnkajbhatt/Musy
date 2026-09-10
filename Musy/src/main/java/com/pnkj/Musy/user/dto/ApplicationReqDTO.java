package com.pnkj.Musy.user.dto;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;

public record ApplicationReqDTO(
        @NotBlank String artistName,
        String bio,
        String genre,
        MultipartFile ProfileImage) {
}
