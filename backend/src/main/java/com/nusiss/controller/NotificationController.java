package com.nusiss.controller;

import com.nusiss.config.AuthenticateUser;
import com.nusiss.dto.GetCartItemsDTO;
import com.nusiss.service.CartService;
import com.nusiss.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("notification")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

//    @GetMapping("/get-all-notifications")
//    public ResponseEntity<List<GetCartItemsDTO>> getCartItems(@AuthenticationPrincipal AuthenticateUser authenticateUser) {
//        UUID userId = authenticateUser.getUserId();
//        return ResponseEntity.ok(cartService.getCartItems(userId));
//    }
//
//    @PostMapping("/mark-as-read")
//    public ResponseEntity<String> addCartItem(@PathVariable("id") UUID listingId, @AuthenticationPrincipal AuthenticateUser authenticateUser) {
//        UUID userId = authenticateUser.getUserId();
//        return cartService.addCartItem(listingId, userId);
//    }

}
