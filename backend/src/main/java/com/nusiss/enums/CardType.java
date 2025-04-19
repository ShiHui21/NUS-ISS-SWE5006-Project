package com.nusiss.enums;

public enum CardType {
    POKEMON_CARD("Pokemon Card"),
    TRAINER_CARD("Trainer_Card");

    private final String cardTypeDisplayName;

    CardType(String cardTypeDisplayName) {
        this.cardTypeDisplayName = cardTypeDisplayName;
    }

    public String getCardTypeDisplayName() {
        return cardTypeDisplayName;
    }
}
