package com.nusiss.dto;

import java.math.BigDecimal;
import java.util.List;

public class GetListingFilterDTO {

    private String username;

    private String listingTitle;

    private List<String> conditions;

    private List<String> listingStatuses;

    private List<String> rarities;

    private List<String> regions;

    private List<String> cardTypes;

    private String title;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private String sortBy = "createdOn";

    private String sortOrder = "asc";

    private String page = "0";

    private String size = "100";

    private boolean excludeCurrentUser;

    public String getUsername() {
        return username;
    }

    public String getListingTitle() {return listingTitle; }

    public List<String> getConditions() {
        return conditions;
    }

    public List<String> getListingStatuses() {
        return listingStatuses;
    }

    public List<String> getRarities() {
        return rarities;
    }

    public List<String> getRegions() {
        return regions;
    }

    public List<String> getCardTypes() { return cardTypes; }

    public String getTitle() {
        return title;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public String getSortBy() {
        return sortBy;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public String getPage() {
        return page;
    }

    public String getSize() {
        return size;
    }

    public boolean isExcludeCurrentUser() {
        return excludeCurrentUser;
    }
}
