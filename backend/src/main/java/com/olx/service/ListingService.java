package com.olx.service;

import com.olx.dto.ListingRequest;
import com.olx.model.Chat;
import com.olx.model.Listing;
import com.olx.model.User;
import com.olx.repository.ChatRepository;
import com.olx.repository.ListingRepository;
import com.olx.repository.MessageRepository;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ListingService {

    private final ListingRepository listingRepository;
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;

    public ListingService(ListingRepository listingRepository, ChatRepository chatRepository, MessageRepository messageRepository) {
        this.listingRepository = listingRepository;
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
    }

    public List<Listing> getAllListings() {
        return listingRepository.findAllByOrderByCreatedAtDesc();
    }

    public Listing getListingById(@NonNull Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
    }

    @SuppressWarnings("null")
    public Listing createListing(ListingRequest request, User user) {
        Listing listing = Listing.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .location(request.getLocation())
                .imageUrl(request.getImageUrl())
                .imageUrls(request.getImageUrls())
                .user(user)
                .build();

        return listingRepository.save(listing);
    }

    public Listing updateListing(@NonNull Long id, ListingRequest request, User user) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only edit your own listings");
        }

        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setCategory(request.getCategory());
        listing.setLocation(request.getLocation());
        listing.setImageUrl(request.getImageUrl());
        if (request.getImageUrls() != null) {
            listing.setImageUrls(request.getImageUrls());
        }

        return listingRepository.save(listing);
    }

    @SuppressWarnings("null")
    @Transactional
    public void deleteListing(@NonNull Long id, User user) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own listings");
        }

        // Delete all chats and their messages related to this listing
        List<Chat> relatedChats = chatRepository.findByListing(listing);
        for (Chat chat : relatedChats) {
            messageRepository.deleteByChat(chat);
        }
        chatRepository.deleteAll(relatedChats);

        // Clear the element collection, then delete the listing
        listing.getImageUrls().clear();
        listingRepository.save(listing);
        listingRepository.delete(listing);
    }

    public List<Listing> searchListings(String keyword) {
        return listingRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    public List<Listing> getMyListings(User user) {
        return listingRepository.findByUser(user);
    }
}

