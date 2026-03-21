package com.olx.dto;

public class ChatRequest {
    private Long listingId;

    public ChatRequest() {}
    public ChatRequest(Long listingId) { this.listingId = listingId; }

    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }
}
