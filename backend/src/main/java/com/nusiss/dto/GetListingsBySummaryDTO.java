package com.nusiss.dto;

import java.util.List;

public class GetListingsBySummaryDTO {

    private List<GetListingSummaryDTO> listings;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int pageSize;

    // Getters and setters
    public List<GetListingSummaryDTO> getListings() {
        return listings;
    }

    public void setListings(List<GetListingSummaryDTO> listings) {
        this.listings = listings;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
}

