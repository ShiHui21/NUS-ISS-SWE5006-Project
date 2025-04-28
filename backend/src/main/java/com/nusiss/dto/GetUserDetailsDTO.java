package com.nusiss.dto;

import com.nusiss.entity.User;

import java.util.UUID;

public class SetUserDetailsDTO {

    private UUID id;

    private String username;

    private String name;

    private String email;

    private String mobileNumber;

    private String location;

//    public UserDTO() {} // No-arg constructor

    public SetUserDetailsDTO(UUID id, String username, String name, String email, String mobileNumber, String location) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.location = location;
    }

    public SetUserDetailsDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.mobileNumber = user.getMobileNumber();
        this.location = user.getLocation();
    }

    public String getUsername() {return this.username; }

    public String getName() { return this.name; }

    public String getEmail() { return this.email; }

    public String getMobileNumber() {return this.mobileNumber; }

    public String getLocation() {return this.location; }

}
