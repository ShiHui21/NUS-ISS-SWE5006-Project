package com.nusiss.dto;

import com.nusiss.entity.Listing;
import com.nusiss.enums.ListingStatus;

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

    private String listingStatus;

    private BigDecimal price;

    private String mainImage;

    private List<String> images;

    private LocalDateTime listedOn;

    private String description;

    private String region;

    private boolean isInCart;

    public GetListingSummaryDTO(Listing listing, boolean isInCart) {

        if (listing.getImages() == null || listing.getImages().isEmpty()) {
            throw new IllegalStateException("Listing must have at least one image.");
        }

        this.id = listing.getId();
        this.listingTitle = listing.getListingTitle();
        this.cardCondition = listing.getCardCondition().getCardConditionDisplayName();
        this.rarity = listing.getRarity().getRarityDisplayName();
        this.cardType = listing.getCardType().getCardTypeDisplayName();
        this.listingStatus = listing.getListingStatus().getListingStatusDisplayName();
        this.price = listing.getPrice();
        this.mainImage = listing.getImages().isEmpty() ? null : listing.getImages().get(0);
        this.images = listing.getImages().isEmpty() ? null : listing.getImages();
        this.listedOn = listing.getCreatedOn();
        this.description = listing.getDescription();
        this.username = listing.getSeller().getUsername();
        this.region = listing.getSeller().getRegion().getRegionDisplayName();
        this.isInCart = isInCart;
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

    public String getListingStatus() {return listingStatus; }

    public String getDescription() { return description; }

    public String getRegion() { return region; }

    public LocalDateTime getListedOn() { return listedOn; }

    public boolean getInCart() { return isInCart; }
}
