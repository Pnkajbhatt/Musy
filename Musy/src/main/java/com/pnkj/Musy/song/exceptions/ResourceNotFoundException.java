package com.pnkj.Musy.song.exceptions;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException {
    private final String code = "Resource_notFound";

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
