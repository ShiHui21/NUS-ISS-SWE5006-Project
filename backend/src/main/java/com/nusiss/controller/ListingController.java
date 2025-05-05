package com.nusiss.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nusiss.config.AuthenticateUser;
import com.nusiss.dto.*;
import com.nusiss.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("listing")
public class ListingController {

    private final ObjectMapper objectMapper;

    private final ListingService listingService;

    private final Validator validator;

    public ListingController(ListingService listingService, ObjectMapper objectMapper, Validator validator) {
        this.listingService = listingService;
        this.objectMapper = objectMapper;
        this.validator = validator;
    }

    @PostMapping(path = "/create-listing")
    public ResponseEntity<String> createListing(
            @RequestPart("data") String rawJson,
            @RequestPart("images") List<MultipartFile> imageFiles,
            @AuthenticationPrincipal AuthenticateUser authenticateUser) throws JsonProcessingException {

        System.out.println("Received create listing request");

        CreateListingDTO createListingDTO = objectMapper.readValue(rawJson, CreateListingDTO.class);

        BindingResult bindingResult = new BeanPropertyBindingResult(createListingDTO, "createListingDTO");
        validator.validate(createListingDTO, bindingResult);

        if(bindingResult.hasErrors()) {
            StringBuilder errorMessages = new StringBuilder();
            for(ObjectError objectError : bindingResult.getAllErrors()) {
                errorMessages.append(objectError.getDefaultMessage()).append(" ");
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
