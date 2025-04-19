package com.nusiss.dto;

import jakarta.validation.constraints.NotBlank;

public class UserCreateDTO {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "password is required")
    private String password;

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "mobileNumber is required")
    private String mobileNumber;

    @NotBlank(message = "location is required")
    private String location;

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    public String getName() { return this.name; }

    public String getEmail() {
        return this.email;
    }

    public String getMobileNumber() {
        return this.mobileNumber;
    }

    public String getLocation() {
        return this.location;
    }

    public void setUsername(String username) {this.username = username; }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
