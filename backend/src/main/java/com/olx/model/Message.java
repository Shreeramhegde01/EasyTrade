package com.olx.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    @JsonIgnoreProperties({"buyer", "seller", "listing"})
    private Chat chat;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    @JsonIgnoreProperties({"listings", "password"})
    private User sender;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public Message() {}

    public Message(Long id, Chat chat, User sender, String content, LocalDateTime timestamp) {
        this.id = id;
        this.chat = chat;
        this.sender = sender;
        this.content = content;
        this.timestamp = timestamp;
    }

    // Getters
    public Long getId() { return id; }
    public Chat getChat() { return chat; }
    public User getSender() { return sender; }
    public String getContent() { return content; }
    public LocalDateTime getTimestamp() { return timestamp; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setChat(Chat chat) { this.chat = chat; }
    public void setSender(User sender) { this.sender = sender; }
    public void setContent(String content) { this.content = content; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    // Builder
    public static MessageBuilder builder() { return new MessageBuilder(); }

    public static class MessageBuilder {
        private Long id;
        private Chat chat;
        private User sender;
        private String content;
        private LocalDateTime timestamp;

        public MessageBuilder id(Long id) { this.id = id; return this; }
        public MessageBuilder chat(Chat chat) { this.chat = chat; return this; }
        public MessageBuilder sender(User sender) { this.sender = sender; return this; }
        public MessageBuilder content(String content) { this.content = content; return this; }
        public MessageBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public Message build() {
            return new Message(id, chat, sender, content, timestamp);
        }
    }
}
