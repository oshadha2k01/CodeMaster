package com.codemaster.backend.entity;

import java.time.LocalDate;
import java.util.List;

public class LearningPlanResponse {

    private Long id;
    private String title;
    private List<String> topics;
    private List<String> resources;
    private LocalDate targetDate;
    private String progress;
    private String username;
    private String profileImage;

    // Constructor
    public LearningPlanResponse(Long id, String title, List<String> topics, List<String> resources,
            LocalDate targetDate, String progress, String username, String profileImage) {
        this.id = id;
        this.title = title;
        this.topics = topics;
        this.resources = resources;
        this.targetDate = targetDate;
        this.progress = progress;
        this.username = username;
        this.profileImage = profileImage;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public List<String> getTopics() {
        return topics;
    }

    public List<String> getResources() {
        return resources;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public String getProgress() {
        return progress;
    }

    public String getUsername() {
        return username;
    }

    public String getProfileImage() {
        return profileImage;
    }
}
