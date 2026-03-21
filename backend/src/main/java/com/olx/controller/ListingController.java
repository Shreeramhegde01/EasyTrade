package com.olx.controller;

import com.olx.dto.ListingRequest;
import com.olx.model.Listing;
import com.olx.model.User;
import com.olx.service.ListingService;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping
    public ResponseEntity<List<Listing>> getAllListings() {
        return ResponseEntity.ok(listingService.getAllListings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getListingById(@PathVariable @NonNull Long id) {
        try {
            return ResponseEntity.ok(listingService.getListingById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createListing(@RequestBody ListingRequest request,
                                           @AuthenticationPrincipal User user) {
        try {
            Listing listing = listingService.createListing(request, user);
            return ResponseEntity.ok(listing);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateListing(@PathVariable @NonNull Long id,
                                           @RequestBody ListingRequest request,
                                           @AuthenticationPrincipal User user) {
        try {
            Listing listing = listingService.updateListing(id, request, user);
            return ResponseEntity.ok(listing);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(@PathVariable @NonNull Long id,
                                           @AuthenticationPrincipal User user) {
        try {
            listingService.deleteListing(id, user);
            return ResponseEntity.ok(Map.of("message", "Listing deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Listing>> searchListings(@RequestParam String keyword) {
        return ResponseEntity.ok(listingService.searchListings(keyword));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Listing>> getMyListings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(listingService.getMyListings(user));
    }
}
