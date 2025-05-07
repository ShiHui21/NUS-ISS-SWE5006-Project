package com.nusiss.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class UpdateListingDTO {

    @NotBlank(message = "Listing Title is required!")
    private String listingTitle;

    @NotBlank(message = "Card Condition is required!")
    private String cardCondition;

    @NotBlank(message = "Card Type is required!")
    private String cardType;

    @NotBlank(message = "Rarity is required!")
    private String rarity;

    private List<String> images = new ArrayList<>();

    @NotNull(message = "Selling price for card is required!")
    private BigDecimal price;

    private String description;

    public String getListingTitle() { return listingTitle; }

    public String getCardCondition() { return cardCondition; }

    public String getCardType() { return cardType; }

    public String getRarity() { return rarity; }

    public List<String> getImages() { return images; }

    public BigDecimal getPrice() { return price; }

    public String getDescription() { return description; }

}
