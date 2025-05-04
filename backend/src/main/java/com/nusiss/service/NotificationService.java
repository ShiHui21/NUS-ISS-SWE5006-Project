package com.nusiss.service;

import com.nusiss.config.NotificationWebSocketHandler;
import com.nusiss.entity.Notification;
import com.nusiss.entity.User;
import com.nusiss.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final NotificationWebSocketHandler notificationWebSocketHandler;

    NotificationService(NotificationRepository notificationRepository, NotificationWebSocketHandler notificationWebSocketHandler) {
        this.notificationRepository = notificationRepository;
        this.notificationWebSocketHandler = notificationWebSocketHandler;
    }

    public void createNotification(User user, String message) {
        Notification notification = new Notification(user, message);
        notificationRepository.save(notification);  // Save to the database
    }

    // Send real-time notification to an online user
    public void sendRealTimeNotification(User user, String message) throws IOException{
        try {
            // Attempt to send the message to the WebSocket session (real-time)
            notificationWebSocketHandler.sendNotification(user.getId().toString(), message);
        } catch (IOException e) {
            // If WebSocket is unavailable (i.e., the user is offline), save the notification in the database
            System.out.println("Error");
//            System.out.println("User is offline, saving notification to database.");
//            createNotification(user, message);  // Save notification for offline users
        }
    }
}
