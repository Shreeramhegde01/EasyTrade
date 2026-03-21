package com.olx.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chats")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "buyer_id", nullable = false)
    @JsonIgnoreProperties({"listings", "password"})
    private User buyer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id", nullable = false)
    @JsonIgnoreProperties({"listings", "password"})
    private User seller;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "listing_id", nullable = false)
    @JsonIgnoreProperties({"user", "imageUrls"})
    private Listing listing;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Chat() {}

    public Chat(Long id, User buyer, User seller, Listing listing, LocalDateTime createdAt) {
        this.id = id;
        this.buyer = buyer;
        this.seller = seller;
        this.listing = listing;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() { return id; }
    public User getBuyer() { return buyer; }
    public User getSeller() { return seller; }
    public Listing getListing() { return listing; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setBuyer(User buyer) { this.buyer = buyer; }
    public void setSeller(User seller) { this.seller = seller; }
    public void setListing(Listing listing) { this.listing = listing; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static ChatBuilder builder() { return new ChatBuilder(); }

    public static class ChatBuilder {
        private Long id;
        private User buyer;
        private User seller;
        private Listing listing;
        private LocalDateTime createdAt;

        public ChatBuilder id(Long id) { this.id = id; return this; }
        public ChatBuilder buyer(User buyer) { this.buyer = buyer; return this; }
        public ChatBuilder seller(User seller) { this.seller = seller; return this; }
        public ChatBuilder listing(Listing listing) { this.listing = listing; return this; }
        public ChatBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Chat build() {
            return new Chat(id, buyer, seller, listing, createdAt);
        }
    }
}
