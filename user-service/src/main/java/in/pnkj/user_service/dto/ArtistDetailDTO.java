package in.pnkj.user_service.dto;

public record ArtistDetailDTO(
    Long userId,
    String username,
    String email,
    String artistName,
    String bio,
    String genre,
    String profileImage
) {}
