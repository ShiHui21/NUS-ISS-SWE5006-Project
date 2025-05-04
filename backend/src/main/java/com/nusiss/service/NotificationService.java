package com.nusiss.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nusiss.config.NotificationWebSocketHandler;
import com.nusiss.entity.Notification;
import com.nusiss.entity.User;
import com.nusiss.repository.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

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
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> payload = new HashMap<>();
            payload.put("type", "NEW_NOTIFICATION");
            payload.put("message", message);

            // Convert to JSON string
            String json = objectMapper.writeValueAsString(payload);
            // Attempt to send the message to the WebSocket session (real-time)
            notificationWebSocketHandler.sendNotification(user.getId().toString(), json);

        } catch (IOException e) {
            // If WebSocket is unavailable (i.e., the user is offline), save the notification in the database
            System.out.println("Error sending WebSocket notification");
            throw e; // Let the calling method handle saving to DB fallback
        }
    }
}
