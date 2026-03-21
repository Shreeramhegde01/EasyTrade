package com.olx.repository;

import com.olx.model.Chat;
import com.olx.model.Listing;
import com.olx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByBuyerOrSeller(User buyer, User seller);
    Optional<Chat> findByBuyerAndListing(User buyer, Listing listing);
    List<Chat> findByListing(Listing listing);
}
