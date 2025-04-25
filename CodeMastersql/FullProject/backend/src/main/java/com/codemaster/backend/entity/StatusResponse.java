package com.codemaster.backend.entity;

import java.time.LocalDateTime;
import java.util.Map;

public class StatusResponse {

    private Long id;
    private String imagePath;
    private String caption;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Map<String, String> user; // ✅ Contains username, email, profileImage

    public StatusResponse(Long id, String imagePath, String caption, LocalDateTime createdAt,
            LocalDateTime expiresAt, Map<String, String> user) {
        this.id = id;
        this.imagePath = imagePath;
        this.caption = caption;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.user = user;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getImagePath() {
        return imagePath;
    }

    public String getCaption() {
        return caption;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public Map<String, String> getUser() {
        return user;
    }
}
