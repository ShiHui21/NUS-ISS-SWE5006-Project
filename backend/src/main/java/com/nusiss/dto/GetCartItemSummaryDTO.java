package com.nusiss.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class GetCartItemSummaryDTO {

    private UUID id;

    private String listingTitle;

    private String cardCondition;

    private BigDecimal price;

    private String mainImage;

    public UUID getId() {
        return id;
    }

    public String getListingTitle() {
        return listingTitle;
    }

    public String getCardCondition() {
        return cardCondition;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getMainImage() {
        return mainImage;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setListingTitle(String listingTitle) {
        this.listingTitle = listingTitle;
    }

    public void setCardCondition(String cardCondition) {
        this.cardCondition = cardCondition;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setMainImage(String mainImage) {
        this.mainImage = mainImage;
    }
}
