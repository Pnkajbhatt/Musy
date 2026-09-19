package in.pnkj.music_service.dto;

import in.pnkj.music_service.entity.Genre;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SongRequest(

        @NotBlank @Size(min = 2, max = 50) String title,

        String description,

        @NotNull(message = "Genre is required") Genre genre

) {
}