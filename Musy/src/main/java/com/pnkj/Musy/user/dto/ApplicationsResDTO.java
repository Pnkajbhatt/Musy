package com.pnkj.Musy.user.dto;

import java.time.LocalDateTime;

import com.pnkj.Musy.user.entity.ApplicationStatus;

public record ApplicationsResDTO(
        Long applicationID,
        String username,
        Long userID,
        String bio,
        String genre,
        String imageUrl,
        String artistName,
        ApplicationStatus status,
        LocalDateTime createdAt) {

}
