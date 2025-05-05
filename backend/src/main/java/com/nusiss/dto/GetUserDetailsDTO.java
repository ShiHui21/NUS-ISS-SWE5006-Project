package com.nusiss.dto;

import com.nusiss.entity.User;

import java.util.UUID;

public class GetUserDetailsDTO {

    private UUID id;
    private String username;

    private String name;

    private String email;

    private String mobileNumber;

    private String region;

    public GetUserDetailsDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.mobileNumber = user.getMobileNumber();
        this.region = user.getRegion().getRegionDisplayName();
    }

    public UUID getId() {
        return id;
    }

    public String getUsername() {return this.username; }

    public String getName() { return this.name; }

    public String getEmail() { return this.email; }

    public String getMobileNumber() {return this.mobileNumber; }

    public String getRegion() {return this.region; }

}
