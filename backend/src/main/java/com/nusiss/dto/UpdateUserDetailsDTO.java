package com.nusiss.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public class UpdateUserDetailsDTO {

//    private UUID id;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "mobileNumber is required")
    private String mobileNumber;

    @NotBlank(message = "location is required")
    private String location;

    public String getUsername() {return this.username; }

    public String getName() { return this.name; }

    public String getEmail() { return this.email; }

    public String getMobileNumber() {return this.mobileNumber; }

    public String getLocation() {return this.location; }

}
