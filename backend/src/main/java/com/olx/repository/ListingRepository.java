package com.olx.repository;

import com.olx.model.Listing;
import com.olx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<Listing> findByUser(User user);
    List<Listing> findByCategoryIgnoreCase(String category);
    List<Listing> findAllByOrderByCreatedAtDesc();
}
