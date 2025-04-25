package com.codemaster.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codemaster.backend.entity.Notification;
import com.codemaster.backend.entity.User;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByTimestampDesc(User user);

    void deleteByUser(User user);

}
