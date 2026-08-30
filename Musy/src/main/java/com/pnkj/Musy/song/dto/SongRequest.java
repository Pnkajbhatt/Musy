package com.pnkj.Musy.song.dto;

import com.pnkj.Musy.song.entity.Genre;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SongRequest(

        @NotBlank @Size(min = 2, max = 50) String title,

        @NotNull(message = "userId is required") Long userId,

        @NotBlank String song_url,

        @NotBlank String cover_url,

        String description,

        @NotNull(message = "Genre is required") Genre genre

) {
}