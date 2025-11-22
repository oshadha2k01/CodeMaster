package com.codemaster.backend.controller;

import com.codemaster.backend.entity.ChatMessage;
import com.codemaster.backend.entity.User;
import com.codemaster.backend.repository.ChatMessageRepository;
import com.codemaster.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
public class ChatController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(Map<String, String> payload, Principal principal) {
        String senderEmail = principal.getName();
        String recipientEmail = payload.get("recipientEmail");
        String content = payload.get("content");

        User sender = userRepository.findByEmail(senderEmail).orElseThrow();
        User recipient = userRepository.findByEmail(recipientEmail).orElseThrow();

        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());

        chatMessageRepository.save(message);

        // Push to recipient and sender
        messagingTemplate.convertAndSendToUser(recipientEmail, "/queue/messages", Map.of(
            "senderEmail", senderEmail,
            "content", content,
            "timestamp", message.getTimestamp()
        ));
        
        // Also send back to sender for UI sync if needed (optional depending on frontend logic)
        messagingTemplate.convertAndSendToUser(senderEmail, "/queue/messages", Map.of(
            "senderEmail", senderEmail,
            "content", content,
            "timestamp", message.getTimestamp()
        ));
    }

    @GetMapping("/api/chat/history/{recipientEmail}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable String recipientEmail, Principal principal) {
        User u1 = userRepository.findByEmail(principal.getName()).orElseThrow();
        User u2 = userRepository.findByEmail(recipientEmail).orElseThrow();
        return ResponseEntity.ok(chatMessageRepository.findConversation(u1, u2));
    }
}
