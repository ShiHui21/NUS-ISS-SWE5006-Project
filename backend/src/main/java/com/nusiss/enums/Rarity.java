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
}
