package com.olx.controller;

import com.olx.dto.ChatRequest;
import com.olx.dto.MessageRequest;
import com.olx.model.Chat;
import com.olx.model.Message;
import com.olx.model.User;
import com.olx.service.ChatService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/start")
    public ResponseEntity<?> startChat(@RequestBody ChatRequest request,
                                       @AuthenticationPrincipal User user) {
        try {
            Chat chat = chatService.startChat(request.getListingId(), user);
            return ResponseEntity.ok(chat);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Chat>> getMyChats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getMyChats(user));
    }

    @PostMapping("/{chatId}/message")
    public ResponseEntity<?> sendMessage(@PathVariable Long chatId,
                                         @RequestBody MessageRequest request,
                                         @AuthenticationPrincipal User user) {
        try {
            Message message = chatService.sendMessage(chatId, request.getContent(), user);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long chatId,
                                         @AuthenticationPrincipal User user) {
        try {
            List<Message> messages = chatService.getMessages(chatId, user);
            return ResponseEntity.ok(messages);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<?> deleteChat(@PathVariable Long chatId, @AuthenticationPrincipal User user) {
        try {
            chatService.deleteChat(chatId, user);
            return ResponseEntity.ok(Map.of("message", "Chat deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
