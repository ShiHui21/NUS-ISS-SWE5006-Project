package com.nusiss.controller;

import com.nusiss.config.AuthenticateUser;
import com.nusiss.dto.*;
import com.nusiss.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("listing")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @PostMapping("/create-listing")
    public ResponseEntity<String> createListing(@RequestBody @Valid CreateListingDTO createListingDTO, @AuthenticationPrincipal
    AuthenticateUser authenticateUser, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessages = new StringBuilder();
            for (ObjectError error : bindingResult.getAllErrors()) {
                errorMessages.append(error.getDefaultMessage()).append(" ");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages.toString().trim());
        }
        UUID userId = authenticateUser.getUserId();

        return listingService.createListing(userId, createListingDTO);
    }

    @PutMapping("/update-listing/{id}")
    public ResponseEntity<String> updateListing(@PathVariable("id") UUID listingId, @RequestBody @Valid UpdateListingDTO updateListingDTO, @AuthenticationPrincipal
    AuthenticateUser authenticateUser, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            StringBuilder errorMessages = new StringBuilder();
            for(ObjectError objectError : bindingResult.getAllErrors()) {
                errorMessages.append(objectError.getDefaultMessage()).append(" ");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages.toString().trim());
        }
        UUID userId = authenticateUser.getUserId();

        return listingService.updateListing(listingId, userId, updateListingDTO);
    }

    @DeleteMapping("/delete-listing/{id}")
    public ResponseEntity<String> deleteListing(@PathVariable("id") UUID listingId, @AuthenticationPrincipal AuthenticateUser authenticateUser) {
        UUID userId = authenticateUser.getUserId();

        return listingService.deleteListing(listingId, userId);
    }

    @GetMapping("/get-all-listing")
    public ResponseEntity<GetListingsDTO> getListings(@RequestParam Map<String, String> params,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size,
                                                      @RequestParam boolean excludeUser,
                                                      @AuthenticationPrincipal AuthenticateUser authenticateUser) {
        UUID userId = authenticateUser.getUserId();

        return ResponseEntity.ok(listingService.getListings(params, userId, excludeUser, page, size));
    }

    @GetMapping("/get-listing-details/{id}")
    public ResponseEntity<GetListingDetailsDTO> getListingDetails(@PathVariable("id") UUID listingId, @AuthenticationPrincipal AuthenticateUser authenticateUser) {
        UUID userId = authenticateUser.getUserId();

        return ResponseEntity.ok(listingService.getListingDetails(listingId));
    }

//    @GetMapping("/get-listing/")
}
