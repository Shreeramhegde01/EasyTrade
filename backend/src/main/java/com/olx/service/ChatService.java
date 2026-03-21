package com.olx.service;

import com.olx.model.Chat;
import com.olx.model.Listing;
import com.olx.model.Message;
import com.olx.model.User;
import com.olx.repository.ChatRepository;
import com.olx.repository.ListingRepository;
import com.olx.repository.MessageRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final ListingRepository listingRepository;

    public ChatService(ChatRepository chatRepository, MessageRepository messageRepository, ListingRepository listingRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.listingRepository = listingRepository;
    }

    @SuppressWarnings("null")
    public Chat startChat(Long listingId, User buyer) {
        Objects.requireNonNull(listingId, "Listing ID must not be null");
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getUser().getId().equals(buyer.getId())) {
            throw new RuntimeException("You cannot chat with yourself");
        }

        // Return existing chat if already exists
        return chatRepository.findByBuyerAndListing(buyer, listing)
                .orElseGet(() -> {
                    Chat chat = Chat.builder()
                            .buyer(buyer)
                            .seller(listing.getUser())
                            .listing(listing)
                            .build();
                    return chatRepository.save(chat);
                });
    }

    public List<Chat> getMyChats(User user) {
        return chatRepository.findByBuyerOrSeller(user, user);
    }

    @SuppressWarnings("null")
    public Message sendMessage(Long chatId, String content, User sender) {
        Objects.requireNonNull(chatId, "Chat ID must not be null");
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        // Verify sender is part of the chat
        if (!chat.getBuyer().getId().equals(sender.getId()) &&
            !chat.getSeller().getId().equals(sender.getId())) {
            throw new RuntimeException("You are not part of this chat");
        }

        Message message = Message.builder()
                .chat(chat)
                .sender(sender)
                .content(content)
                .build();

        return messageRepository.save(message);
    }

    public List<Message> getMessages(Long chatId, User user) {
        Objects.requireNonNull(chatId, "Chat ID must not be null");
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        // Verify user is part of the chat
        if (!chat.getBuyer().getId().equals(user.getId()) &&
            !chat.getSeller().getId().equals(user.getId())) {
            throw new RuntimeException("You are not part of this chat");
        }

        return messageRepository.findByChatOrderByTimestampAsc(chat);
    }
}
