package in.pnkj.user_service.exceptions;

import lombok.Getter;

@Getter
public class DuplicateResourceException extends RuntimeException {
    private final String code = "DUPLICATE_RESOURCE";

    public DuplicateResourceException(String message) {
        super(message);
    }
}
