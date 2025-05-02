package com.nusiss.enums;

public enum CardCondition {
    BRAND_NEW("Brand New"),
    LIKE_NEW("Like New"),
    LIGHTLY_USED("Lightly Used"),
    WELL_USED("Well Used"),
    HEAVILY_USED("Heavily Used"),
    DAMAGED("Damage");

    private final String cardConditionDisplayName;

    CardCondition(String cardConditionDisplayName) {
        this.cardConditionDisplayName = cardConditionDisplayName;
    }

    public String getCardConditionDisplayName() {
        return cardConditionDisplayName;
    }

    public static CardCondition fromCardConditionDisplayName(String cardConditionDisplayName) {
        for (CardCondition cardCondition : CardCondition.values()) {
            if (cardCondition.getCardConditionDisplayName().equalsIgnoreCase(cardConditionDisplayName)) {
                return cardCondition;
            }
        }
        throw new IllegalArgumentException("Unknown card condition: " + cardConditionDisplayName);
    }
}
