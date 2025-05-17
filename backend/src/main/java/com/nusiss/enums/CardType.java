package com.nusiss.enums;

public enum CardType {
    POKEMON_CARD("Pokemon Card"),
    TRAINER_CARD("Trainer Card");

    private final String cardTypeDisplayName;

    CardType(String cardTypeDisplayName) {
        this.cardTypeDisplayName = cardTypeDisplayName;
    }

    public String getCardTypeDisplayName() {
        return cardTypeDisplayName;
    }

    public static CardType fromCardTypeDisplayName(String cardTypeDisplayName) {
        for (CardType cardType : CardType.values()) {
            if (cardType.getCardTypeDisplayName().equalsIgnoreCase(cardTypeDisplayName)) {
                return cardType;
            }
        }
        throw new IllegalArgumentException("Unknown card type: " + cardTypeDisplayName);
    }
}
