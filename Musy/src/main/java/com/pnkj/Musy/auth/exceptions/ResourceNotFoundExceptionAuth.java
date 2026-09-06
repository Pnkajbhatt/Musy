package com.pnkj.Musy.auth.exceptions;

import lombok.Getter;

@Getter
public class ResourceNotFoundExceptionAuth extends RuntimeException {
    private final String code = "RESOURCE_NOT_FOUND";

    public ResourceNotFoundExceptionAuth(String message) {
        super(message);
    }
}
