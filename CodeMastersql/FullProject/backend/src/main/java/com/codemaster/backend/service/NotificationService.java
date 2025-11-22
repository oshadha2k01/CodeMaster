package com.codemaster.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.codemaster.backend.entity.Notification;
import com.codemaster.backend.entity.User;
import com.codemaster.backend.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void createNotification(User recipient, String message) {
        Notification notification = new Notification();
        notification.setUser(recipient);
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        notificationRepository.save(notification);

        // Push real-time notification
        messagingTemplate.convertAndSendToUser(recipient.getEmail(), "/queue/notifications", message);
    }

    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderByTimestampDesc(user);
    }

    public void markAllAsRead(User user) {
        List<Notification> notis = notificationRepository.findByUserOrderByTimestampDesc(user);
        notis.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notis);
    }
}
