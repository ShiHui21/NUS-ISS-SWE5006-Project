package com.nusiss.enums;

public enum Region {
    CENTRAL_REGION("Central Region"),
    NORTH_REGION("North Region"),
    EAST_REGION("East Region"),
    NORTH_EAST_REGION("North East Region"),
    WEST_REGION("West Region");

    private final String regionDisplayName;
    Region(String regionDisplayName){ this.regionDisplayName = regionDisplayName; }

    public String getRegionDisplayName() {
        return regionDisplayName;
    }

    public static Region fromRegionDisplayName(String regionDisplayName) {
        for (Region region : Region.values()) {
            if (region.getRegionDisplayName().equalsIgnoreCase(regionDisplayName)) {
                return region;
            }
        }
        throw new IllegalArgumentException("Unknown rarity: " + regionDisplayName);
    }
}
