package com.nusiss.controller;

import com.nusiss.config.AuthenticateUser;
import com.nusiss.dto.GetCartItemsDTO;
import com.nusiss.dto.GetNotificationsDTO;
import com.nusiss.service.CartService;
import com.nusiss.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("notification")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/get-all-notifications")
    public ResponseEntity<List<GetNotificationsDTO>> getNotifications(@AuthenticationPrincipal AuthenticateUser authenticateUser) {
        UUID userId = authenticateUser.getUserId();
        return ResponseEntity.ok(notificationService.getNotifications(userId));
    }

    @PutMapping("/mark-as-read/{id}")
    public ResponseEntity<Map<String, String>> markNotificationAsRead(@PathVariable("id") Long notificationId, @AuthenticationPrincipal AuthenticateUser authenticateUser) {
        return notificationService.markNotificationAsRead(notificationId);
    }

}
