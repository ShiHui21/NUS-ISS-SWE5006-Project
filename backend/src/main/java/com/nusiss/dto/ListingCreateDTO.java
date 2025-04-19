package com.nusiss.dto;

import com.nusiss.enums.CardType;
import com.nusiss.enums.CardCondition;
import com.nusiss.enums.Rarity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ListingCreateDTO {

    private String listingTitle;

    private CardCondition cardCondition;

    private CardType cardType;

    private Rarity rarity;

    private List<String> images = new ArrayList<>();

    private BigDecimal price;

    private String status;

    private String description;

    public String getListingTitle() { return listingTitle; }

    public CardCondition getCardCondition() { return cardCondition; }

    public CardType getCardType() { return cardType; }

    public Rarity getRarity() { return rarity; }

    public List<String> getImages() { return images; }

    public BigDecimal getPrice() { return price; }

    public String getStatus() {return status; }

    public String getDescription() { return description; }

}
