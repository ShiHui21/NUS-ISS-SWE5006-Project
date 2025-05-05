package com.nusiss.controller;

import com.nusiss.config.AuthenticateUser;
import com.nusiss.dto.*;
import com.nusiss.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("listing")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @PostMapping(path = "/create-listing", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createListing(
            @RequestPart("data") @Valid CreateListingDTO createListingDTO,
            @RequestPart("images") List<MultipartFile> imageFiles,
            @AuthenticationPrincipal AuthenticateUser authenticateUser,
            BindingResult bindingResult) {

        System.out.println("Received create listing request");
        if (bindingResult.hasErrors()) {
            StringBuilder errorMessages = new StringBuilder();
            for (ObjectError error : bindingResult.getAllErrors()) {
                errorMessages.append(error.getDefaultMessage()).append(" ");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages.toString().trim());
        }
        UUID userId = authenticateUser.getUserId();

        return listingService.createListing(userId, createListingDTO, imageFiles);
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

    @PutMapping("/update-listing-as-sold/{id}")
    public ResponseEntity<String> updateListingAsSold(@PathVariable("id") UUID listingId, @AuthenticationPrincipal AuthenticateUser authenticateUser) {
        return listingService.updateListingAsSold(listingId);
    }

    @DeleteMapping("/delete-listing/{id}")
    public ResponseEntity<String> deleteListing(@PathVariable("id") UUID listingId, @AuthenticationPrincipal AuthenticateUser authenticateUser) {
        UUID userId = authenticateUser.getUserId();

        return listingService.deleteListing(listingId, userId);
    }

    @PostMapping("/get-all-listing")
    public ResponseEntity<GetListingsDTO> getListings(@RequestBody GetListingFilterDTO getListingFilterDTO,
                                                      @AuthenticationPrincipal AuthenticateUser authenticateUser) {
        UUID userId = authenticateUser.getUserId();

        return ResponseEntity.ok(listingService.getListings(getListingFilterDTO, userId));
    }

    @GetMapping("/get-listing-details/{id}")
    public ResponseEntity<GetListingDetailsDTO> getListingDetails(@PathVariable("id") UUID listingId, @AuthenticationPrincipal AuthenticateUser authenticateUser) {
        UUID userId = authenticateUser.getUserId();

        return ResponseEntity.ok(listingService.getListingDetails(listingId));
    }

//    @GetMapping("/get-listing/")
}
