package com.nusiss.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // User who will receive the notification

    private String message;  // Notification message content

    private boolean isRead;  // Whether the notification has been read by the user

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;  // Timestamp of the notification creation

    // Constructor and getters/setters
    public Notification(User user, String message) {
        this.user = user;
        this.message = message;
        this.isRead = false;  // Initially unread
        this.createdAt = LocalDateTime.now();
    }
}
