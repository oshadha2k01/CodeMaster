// package com.codemaster.backend.entity;

// import java.time.LocalDate;
// import java.util.List;

// import org.hibernate.annotations.OnDelete;
// import org.hibernate.annotations.OnDeleteAction;

// import jakarta.persistence.ElementCollection;
// import jakarta.persistence.Entity;
// import jakarta.persistence.FetchType;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.Table;

// @Entity
// @Table(name = "learning_plans")
// public class LearningPlan {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     private String title;

//     @ElementCollection
//     private List<String> topics;

//     @ElementCollection
//     private List<String> resources;

//      private LocalDate targetDate;

//     private String progress;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "user_id", nullable = false)
//     @OnDelete(action = OnDeleteAction.CASCADE) // ✅ This enables cascade delete
//     private User user;

//     // --- Constructors ---
//     public LearningPlan() {
//     }

//     public LearningPlan(Long id, String title, List<String> topics, List<String> resources,
//             LocalDate targetDate, String progress, User user) {
//         this.id = id;
//         this.title = title;
//         this.topics = topics;
//         this.resources = resources;
//         this.targetDate = targetDate;
//         this.progress = progress;
//         this.user = user;
//     }

//     // --- Getters and Setters ---
//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getTitle() {
//         return title;
//     }

//     public void setTitle(String title) {
//         this.title = title;
//     }

//     public List<String> getTopics() {
//         return topics;
//     }

//     public void setTopics(List<String> topics) {
//         this.topics = topics;
//     }

//     public List<String> getResources() {
//         return resources;
//     }

//     public void setResources(List<String> resources) {
//         this.resources = resources;
//     }

//     public LocalDate getTargetDate() {
//         return targetDate;
//     }

//     public void setTargetDate(LocalDate targetDate) {
//         this.targetDate = targetDate;
//     }

//     public String getProgress() {
//         return progress;
//     }

//     public void setProgress(String progress) {
//         this.progress = progress;
//     }

//     public User getUser() {
//         return user;
//     }

//     public void setUser(User user) {
//         this.user = user;
//     }
// }



package com.codemaster.backend.entity;

import java.time.LocalDate;
import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "learning_plans")
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @ElementCollection
    @CollectionTable(name = "learning_plan_topics", joinColumns = @JoinColumn(name = "learning_plan_id"))
    @Size(min = 1, message = "At least one topic is required")
    private List<@NotBlank String> topics;

    @ElementCollection
    @CollectionTable(name = "learning_plan_resources", joinColumns = @JoinColumn(name = "learning_plan_id"))
    private List<@NotBlank String> resources;

    @NotNull(message = "Target date is required")
    @Future(message = "Target date must be in the future")
    private LocalDate targetDate;

    @NotBlank(message = "Progress status is required")
    private String progress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE) // Ensures plan is deleted if the user is deleted
    private User user;

    // --- Constructors ---
    public LearningPlan() {
    }

    public LearningPlan(Long id, String title, List<String> topics, List<String> resources,
                        LocalDate targetDate, String progress, User user) {
        this.id = id;
        this.title = title;
        this.topics = topics;
        this.resources = resources;
        this.targetDate = targetDate;
        this.progress = progress;
        this.user = user;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public List<String> getResources() {
        return resources;
    }

    public void setResources(List<String> resources) {
        this.resources = resources;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(String progress) {
        this.progress = progress;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
