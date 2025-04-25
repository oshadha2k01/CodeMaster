package com.codemaster.backend.entity;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "follows")
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "following_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User following;

    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User follower;

    @Enumerated(EnumType.STRING)
    private FollowStatus status = FollowStatus.PENDING;

    // --- Constructors ---
    public Follow() {
    }

    public Follow(Long id, User follower, User following, FollowStatus status) {
        this.id = id;
        this.follower = follower;
        this.following = following;
        this.status = status;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getFollower() {
        return follower;
    }

    public void setFollower(User follower) {
        this.follower = follower;
    }

    public User getFollowing() {
        return following;
    }

    public void setFollowing(User following) {
        this.following = following;
    }

    public FollowStatus getStatus() {
        return status;
    }

    public void setStatus(FollowStatus status) {
        this.status = status;
    }
}
