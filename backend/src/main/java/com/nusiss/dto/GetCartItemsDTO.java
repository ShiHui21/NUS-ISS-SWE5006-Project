package com.nusiss.dto;

import java.util.List;
import java.util.UUID;

public class GetCartItemsDTO {

    private String sellerName;

    private List<GetCartItemSummaryDTO> items;

    public String getSellerName() { return sellerName; }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public List<GetCartItemSummaryDTO> getItems() { return items; }

    public void setItems(List<GetCartItemSummaryDTO> items) {
        this.items = items;
    }
}
