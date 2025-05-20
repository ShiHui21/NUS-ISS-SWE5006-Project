package com.nusiss.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nusiss.config.NotificationWebSocketHandler;
import com.nusiss.dto.GetListingSummaryDTO;
import com.nusiss.dto.GetNotificationsDTO;
import com.nusiss.entity.CartItem;
import com.nusiss.entity.Listing;
import com.nusiss.entity.Notification;
import com.nusiss.entity.User;
import com.nusiss.patterns.observer.ListingObserver;
import com.nusiss.repository.CartItemRepository;
import com.nusiss.repository.CartRepository;
import com.nusiss.repository.NotificationRepository;
import com.nusiss.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService implements ListingObserver {

    private final NotificationRepository notificationRepository;
    private final CartItemRepository cartItemRepository;
    private final NotificationWebSocketHandler notificationWebSocketHandler;

    NotificationService(NotificationRepository notificationRepository, CartItemRepository cartItemRepository, NotificationWebSocketHandler notificationWebSocketHandler) {
        this.notificationRepository = notificationRepository;
        this.cartItemRepository = cartItemRepository;
        this.notificationWebSocketHandler = notificationWebSocketHandler;
    }

    public void createNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setRead(false);
        notification.setMessage(message);
        notification.setUser(user);
        notificationRepository.save(notification);  // Save to the database
    }

    public List<GetNotificationsDTO> getNotifications(UUID userId) {
        List<Notification> notifications = notificationRepository.findAllByUser_Id(userId);

        return notifications.stream()
                .filter(notification -> !notification.isRead()) // Only keep unread notifications
                .map(GetNotificationsDTO::new) // Map to DTO
                .collect(Collectors.toList()); // Collect into a List<GetNotificationsDTO>
    }

    public ResponseEntity<Map<String, String>> markNotificationAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));

        notification.setRead(true);

        Map<String, String> response = new HashMap<>();
        String message = "Notification marked as read";
        response.put("message", message);

        return ResponseEntity.ok(response);
    }

    // Send real-time notification to an online user
    public void sendRealTimeNotification(User user, String message) {
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
//            throw e; // Let the calling method handle saving to DB fallback
        }
    }

    @Override
    public void onListingSold(Listing listing) {
        List<CartItem> cartItems = cartItemRepository.findByListing_Id(listing.getId());
        for (CartItem cartItem : cartItems) {
            User user = cartItem.getCart().getUser();

            String message = "Listing: " + listing.getListingTitle() + " by " + listing.getSeller().getUsername() + " is no longer available!";
            createNotification(user, message);
            sendRealTimeNotification(user, message);
            System.out.println(message);
        }
    }
}
