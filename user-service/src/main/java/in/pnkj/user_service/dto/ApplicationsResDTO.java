package in.pnkj.user_service.dto;

import java.time.LocalDateTime;

import in.pnkj.user_service.entity.ApplicationStatus;

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
