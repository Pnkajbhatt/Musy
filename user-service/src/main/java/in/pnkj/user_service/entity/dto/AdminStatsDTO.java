package in.pnkj.user_service.entity.dto;

public record AdminStatsDTO(
    long totalUsers,
    long totalArtists,
    long totalListeners,
    long pendingApplications
) {}
