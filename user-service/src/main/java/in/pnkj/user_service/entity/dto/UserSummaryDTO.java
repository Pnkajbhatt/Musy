package in.pnkj.user_service.entity.dto;

import java.time.Instant;

public record UserSummaryDTO(
    Long userId,
    String username,
    String email,
    String role,
    Instant createdAt
) {}
