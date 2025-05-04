package com.nusiss.enums;

public enum ListingStatus {
    ACTIVE("Active"),
    SOLD("Sold"),
    DELETED("Deleted");

    private final String listingStatusDisplayName;

    ListingStatus(String listingStatusDisplayName) {
        this.listingStatusDisplayName = listingStatusDisplayName;
    }

    public String getListingStatusDisplayName() {
        return listingStatusDisplayName;
    }

    public static ListingStatus fromListingStatusDisplayName(String listingStatusDisplayName) {
        for (ListingStatus listingStatus : ListingStatus.values()) {
            if (listingStatus.getListingStatusDisplayName().equalsIgnoreCase(listingStatusDisplayName)) {
                return listingStatus;
            }
        }
        throw new IllegalArgumentException("Unknown listing status: " + listingStatusDisplayName);
    }
}
