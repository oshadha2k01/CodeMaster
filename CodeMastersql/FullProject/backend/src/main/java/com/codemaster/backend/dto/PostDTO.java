package com.codemaster.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PostDTO {
    private Long id;
    private String title;
    private String description;
    private List<String> mediaPaths;
    private LocalDateTime createdAt;
    private UserDTO user;
    private int likeCount;
    private boolean liked;
    private int commentCount;
    private List<CommentDTO> latestComments;

    // Constructors, Getters, and Setters
    public PostDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getMediaPaths() { return mediaPaths; }
    public void setMediaPaths(List<String> mediaPaths) { this.mediaPaths = mediaPaths; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }
    public boolean isLiked() { return liked; }
    public void setLiked(boolean liked) { this.liked = liked; }
    public int getCommentCount() { return commentCount; }
    public void setCommentCount(int commentCount) { this.commentCount = commentCount; }
    public List<CommentDTO> getLatestComments() { return latestComments; }
    public void setLatestComments(List<CommentDTO> latestComments) { this.latestComments = latestComments; }

    public static class UserDTO {
        private Long id;
        private String username;
        private String email;
        private String profileImage;

        public UserDTO() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getProfileImage() { return profileImage; }
        public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    }

    public static class CommentDTO {
        private Long id;
        private String content;
        private UserDTO user;

        public CommentDTO() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public UserDTO getUser() { return user; }
        public void setUser(UserDTO user) { this.user = user; }
    }
}
