package com.nusiss.controller;

import com.nusiss.config.AuthenticateUser;
import com.nusiss.dto.GetCartItemsDTO;
import com.nusiss.entity.User;
import com.nusiss.service.CartService;
import com.nusiss.service.ListingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add-to-cart/{id}")
    public ResponseEntity<String> addCartItem(@PathVariable("id") UUID listingId, @AuthenticationPrincipal AuthenticateUser authenticateUser) {
        UUID userId = authenticateUser.getUserId();
        return cartService.addCartItem(listingId, userId);
    }

    @DeleteMapping("/delete-from-cart/{id}")
    public ResponseEntity<String> deleteCartItem(@PathVariable("id") UUID listingId, @AuthenticationPrincipal AuthenticateUser authenticateUser) {
        UUID userId = authenticateUser.getUserId();
        return cartService.deleteCartItem(listingId, userId);
    }

    @GetMapping("/get-cart-items")
    public ResponseEntity<List<GetCartItemsDTO>> getCartItems(@AuthenticationPrincipal AuthenticateUser authenticateUser) {
        UUID userId = authenticateUser.getUserId();
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

}
