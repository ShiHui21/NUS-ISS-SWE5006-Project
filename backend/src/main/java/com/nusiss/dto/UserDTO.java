package com.nusiss.dto;

import com.nusiss.entity.User;

import java.util.UUID;

public class UserDTO {
    private UUID id;
    private String username;
    private String name;
    private String email;
    private String mobileNumber;
    private String location;

    public UserDTO(User user) {
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.mobileNumber = user.getMobileNumber();
        this.location = user.getLocation();
    }

    // Getters and setters
}
