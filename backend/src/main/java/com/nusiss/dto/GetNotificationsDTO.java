package com.nusiss.dto;

import com.nusiss.entity.Notification;

import java.time.LocalDateTime;

public class GetNotificationsDTO {

    private Long id;

    private String message;

    private boolean isRead;

    private LocalDateTime createOn;

    public GetNotificationsDTO(Notification notification) {
        this.id = notification.getId();
        this.message = notification.getMessage();  // Assuming Notification has getMessage() method
        this.createOn = notification.getCreatedOn();
        this.isRead = notification.isRead();      // Assuming Notification has isRead() method
    }

    public LocalDateTime getCreateOn() {
        return createOn;
    }

    public boolean isRead() {
        return isRead;
    }

    public String getMessage() {
        return message;
    }

    public Long getId() {
        return id;
    }
}
