package com.nusiss.exception;

import java.util.UUID;

public class UserNotFoundException extends UserException {
    public UserNotFoundException(UUID id) {
        super("User not found with id: " + id);
    }
}
