package com.nusiss.dto;

import com.nusiss.entity.Listing;
import com.nusiss.enums.CardCondition;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class GetListingDetailsDTO {

    private UUID id;

    private String listingTitle;

    private String cardCondition;

    private String cardType;

    private String rarity;

    private BigDecimal price;

    private List<String> images;

    private String status;

    private String description;

    private String username;

    private LocalDateTime listedOn;

    public GetListingDetailsDTO(Listing listing) {
        this.id = listing.getId();
        this.username = listing.getSeller().getUsername();
        this.listingTitle = listing.getListingTitle();
        this.cardCondition = listing.getCardCondition().getCardConditionDisplayName();
        this.cardType = listing.getCardType().getCardTypeDisplayName();
        this.rarity = listing.getRarity().getRarityDisplayName();
        this.price = listing.getPrice();
        this.images = listing.getImages();
        this.status = listing.getStatus();
        this.description = listing.getDescription();
        this.listedOn = listing.getCreatedOn();
    }

    // Getters
    public UUID getId() { return id; }

    public String getListingTitle() { return listingTitle; }

    public String getCardCondition() { return cardCondition; }

    public String getCardType() { return cardType; }

    public String getRarity() { return rarity; }

    public BigDecimal getPrice() { return price; }

    public List<String> getImages() { return images; }

    public String getStatus() {return status; }

    public String getDescription() { return description; }

    public LocalDateTime getListedOn() { return listedOn; }

    public String getUsername() { return username; }
}
