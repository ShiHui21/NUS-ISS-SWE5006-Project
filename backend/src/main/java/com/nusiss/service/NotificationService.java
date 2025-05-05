package com.nusiss.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nusiss.config.NotificationWebSocketHandler;
import com.nusiss.dto.GetListingSummaryDTO;
import com.nusiss.dto.GetNotificationsDTO;
import com.nusiss.entity.Notification;
import com.nusiss.entity.User;
import com.nusiss.repository.NotificationRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        Notification notification = new Notification();
        notification.setRead(false);
        notification.setMessage(message);
        notification.setUser(user);
        notificationRepository.save(notification);  // Save to the database
    }

    public List<GetNotificationsDTO> getNotifications(User user) {
        List<Notification> notifications = notificationRepository.findAllByUser_Id(user.getId());

        return notifications.stream()
                .filter(notification -> !notification.isRead()) // Only keep unread notifications
                .map(GetNotificationsDTO::new) // Map to DTO
                .collect(Collectors.toList()); // Collect into a List<GetNotificationsDTO>
    }

    public void deleteNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));
        notificationRepository.delete(notification);
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
