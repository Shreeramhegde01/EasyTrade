package com.olx.repository;

import com.olx.model.Chat;
import com.olx.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatOrderByTimestampAsc(Chat chat);
    void deleteByChat(Chat chat);
}
