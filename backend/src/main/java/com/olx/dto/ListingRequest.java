package com.olx.dto;

import java.util.List;

public class ListingRequest {
    private String title;
    private String description;
    private Double price;
    private String category;
    private String location;
    private String imageUrl;
    private List<String> imageUrls;

    public ListingRequest() {}

    public ListingRequest(String title, String description, Double price, String category,
                          String location, String imageUrl, List<String> imageUrls) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.imageUrl = imageUrl;
        this.imageUrls = imageUrls;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
