package com.nusiss.enums;

public enum Rarity {
    COMMON("Common"),
    UNCOMMON("Uncommon"),
    RARE("Rare"),
    DOUBLE_RARE("Double Rare"),
    ILLUSTRATION_RARE("Illustration Rare"),
    SPECIAL_ILLUSTRATION_RARE("Special Illustration Rare"),
    HYPER_RARE("Hyper Rare");

    private final String rarityDisplayName;

    Rarity(String rarityDisplayName) {
        this.rarityDisplayName = rarityDisplayName;
    }

    public String getRarityDisplayName() {
        return rarityDisplayName;
    }

    public static Rarity fromRarityDisplayName(String rarityDisplayName) {
        for (Rarity rarity : Rarity.values()) {
            if (rarity.getRarityDisplayName().equalsIgnoreCase(rarityDisplayName)) {
                return rarity;
            }
        }
        throw new IllegalArgumentException("Unknown rarity: " + rarityDisplayName);
    }
}
