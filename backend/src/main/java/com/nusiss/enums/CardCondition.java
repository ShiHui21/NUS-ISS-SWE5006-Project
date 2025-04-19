package com.nusiss.enums;

public enum CardCondition {
    BRAND_NEW("Brand New"),
    LIKE_NEW("Like New"),
    LIGHTLY_USED("Lightly Used"),
    WELL_USED("Well Used"),
    HEAVILY_USED("Heavily Used"),
    DAMAGED("Damage");

    private final String conditionDisplayName;

    CardCondition(String conditionDisplayName) {
        this.conditionDisplayName = conditionDisplayName;
    }

    public String getConditionDisplayName() {
        return conditionDisplayName;
    }
}
