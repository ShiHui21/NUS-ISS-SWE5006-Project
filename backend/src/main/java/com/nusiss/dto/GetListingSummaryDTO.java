package com.nusiss.dto;

import com.nusiss.entity.Listing;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class GetListingSummaryDTO {

    private UUID id;

    private String username;

    private String listingTitle;

    private String cardCondition;

    private String cardType;

    private String rarity;

    private BigDecimal price;

    private String mainImage;

    private List<String> images;

    private LocalDateTime listedOn;

    private String description;

    private boolean isSold;


    public GetListingSummaryDTO(Listing listing) {

        if (listing.getImages() == null || listing.getImages().isEmpty()) {
            throw new IllegalStateException("Listing must have at least one image.");
        }

        this.id = listing.getId();
        this.listingTitle = listing.getListingTitle();
        this.cardCondition = listing.getCardCondition().getCardConditionDisplayName();
        this.rarity = listing.getRarity().getRarityDisplayName();
        this.cardType = listing.getCardType().getCardTypeDisplayName();
        this.price = listing.getPrice();
        this.mainImage = listing.getImages().isEmpty() ? null : listing.getImages().get(0);
        this.images = listing.getImages().isEmpty() ? null : listing.getImages();
        this.listedOn = listing.getCreatedOn();
        this.description = listing.getDescription();
        this.isSold = listing.getSoldStatus();
        this.username = listing.getSeller().getUsername();
    }

    public UUID getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getListingTitle() {
        return listingTitle;
    }

    public String getCardCondition() {
        return cardCondition;
    }

    public String getCardType() { return cardType; }

    public String getRarity() { return rarity; }

    public BigDecimal getPrice() {
        return price;
    }

    public String getMainImage() {
        return mainImage;
    }

    public List<String> getImages() { return images; }

    public boolean getSoldStatus() {return isSold; }

    public String getDescription() { return description; }

    public LocalDateTime getListedOn() { return listedOn; }
}
