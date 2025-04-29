package com.nusiss.dto;

import com.nusiss.entity.Listing;

import java.util.List;

public class GetListingsByUserDTO {

    private String username;
    private String location;
    private List<GetListingSummaryDTO> listings;

    public GetListingsByUserDTO(String username, String location, List<GetListingSummaryDTO> listings) {
        this.username = username;
        this.location = location;
        this.listings = listings;
    }

    // Getter for username
    public String getUsername() {
        return username;
    }

    // Getter for location
    public String getLocation() {
        return location;
    }

    // Getter for listings
    public List<GetListingSummaryDTO> getListings() {
        return listings;
    }
}
