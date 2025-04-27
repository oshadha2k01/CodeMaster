package com.codemaster.backend.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "post_media_paths", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "media_path")
    private List<String> mediaPaths = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "post_likes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> likedBy = new HashSet<>();

    // Constructors
    public Post() {}

    public Post(Long id, String title, String description, List<String> mediaPaths,
                LocalDateTime createdAt, User user, Set<User> likedBy) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.mediaPaths = mediaPaths;
        this.createdAt = createdAt;
        this.user = user;
        this.likedBy = likedBy;
    }

    // Getters and Setters
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

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public Set<User> getLikedBy() { return likedBy; }

    public void setLikedBy(Set<User> likedBy) { this.likedBy = likedBy; }
}
