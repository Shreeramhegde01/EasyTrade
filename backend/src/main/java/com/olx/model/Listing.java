package com.olx.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "listings")
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Double price;

    private String category;

    private String location;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"listings", "password"})
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "listing_images", joinColumns = @JoinColumn(name = "listing_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Listing() {}

    public Listing(Long id, String title, String description, Double price, String category,
                   String location, String imageUrl, User user, LocalDateTime createdAt, List<String> imageUrls) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.location = location;
        this.imageUrl = imageUrl;
        this.user = user;
        this.createdAt = createdAt;
        this.imageUrls = imageUrls != null ? imageUrls : new ArrayList<>();
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Double getPrice() { return price; }
    public String getCategory() { return category; }
    public String getLocation() { return location; }
    public String getImageUrl() { return imageUrl; }
    public User getUser() { return user; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<String> getImageUrls() { return imageUrls; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(Double price) { this.price = price; }
    public void setCategory(String category) { this.category = category; }
    public void setLocation(String location) { this.location = location; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setUser(User user) { this.user = user; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    // Builder
    public static ListingBuilder builder() { return new ListingBuilder(); }

    public static class ListingBuilder {
        private Long id;
        private String title;
        private String description;
        private Double price;
        private String category;
        private String location;
        private String imageUrl;
        private User user;
        private LocalDateTime createdAt;
        private List<String> imageUrls = new ArrayList<>();

        public ListingBuilder id(Long id) { this.id = id; return this; }
        public ListingBuilder title(String title) { this.title = title; return this; }
        public ListingBuilder description(String description) { this.description = description; return this; }
        public ListingBuilder price(Double price) { this.price = price; return this; }
        public ListingBuilder category(String category) { this.category = category; return this; }
        public ListingBuilder location(String location) { this.location = location; return this; }
        public ListingBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ListingBuilder user(User user) { this.user = user; return this; }
        public ListingBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ListingBuilder imageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; return this; }

        public Listing build() {
            return new Listing(id, title, description, price, category, location, imageUrl, user, createdAt, imageUrls);
        }
    }
}
