package com.pnkj.Musy.song.exceptions;

import lombok.Getter;

@Getter
public class ResourceNotFoundExceptionSong extends RuntimeException {
    private final String code = "Resource_notFound";

    public ResourceNotFoundExceptionSong(String message) {
        super(message);
    }
}
