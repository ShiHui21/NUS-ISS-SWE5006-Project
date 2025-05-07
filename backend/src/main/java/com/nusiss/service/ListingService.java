package com.nusiss.service;

import com.nusiss.dto.*;
import com.nusiss.entity.CartItem;
import com.nusiss.entity.Listing;
import com.nusiss.entity.User;
import com.nusiss.enums.CardCondition;
import com.nusiss.enums.CardType;
import com.nusiss.enums.ListingStatus;
import com.nusiss.enums.Rarity;
import com.nusiss.patterns.factory.ListingFactory;
import com.nusiss.patterns.factory.PokemonCardListingFactory;
import com.nusiss.patterns.factory.TrainerCardListingFactory;
import com.nusiss.patterns.strategy.FilterSearchStrategy;
import com.nusiss.patterns.strategy.SearchStrategy;
import com.nusiss.patterns.strategy.UserExclusionStrategy;
import com.nusiss.patterns.strategy.UsernameSearchStrategy;
import com.nusiss.repository.CartItemRepository;
import com.nusiss.repository.ListingRepository;
import com.nusiss.repository.UserRepository;
import com.nusiss.util.ChangeTrackerUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ListingService {

    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final CartItemRepository cartItemRepository;
    private final NotificationService notificationService;
    private final CartService cartService;
    private final ListingSearchService listingSearchService;
    private final S3Service s3Service;

    public ListingService(UserRepository userRepository, ListingRepository listingRepository, NotificationService notificationService, CartItemRepository cartItemRepository, CartService cartService, ListingSearchService listingSearchService, S3Service s3Service) {
        this.userRepository = userRepository;
        this.listingRepository = listingRepository;
        this.cartItemRepository = cartItemRepository;
        this.notificationService = notificationService;
        this.cartService = cartService;
        this.listingSearchService = listingSearchService;
        this.s3Service = s3Service;
    }

    public ResponseEntity<String> createListing(UUID id, CreateListingDTO createListingDTO, List<MultipartFile> imageFiles) {
        System.out.println("Inside createListing method");

        if (imageFiles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("At least one image must be provided.");
        }

        User seller = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Upload files to S3 and get URLs
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : imageFiles) {
            String imageUrl = s3Service.uploadFile(file);
            imageUrls.add(imageUrl);
        }

        // Set uploaded image URLs into the DTO
        createListingDTO.setImages(imageUrls);

        ListingFactory factory = getFactoryByCardType(CardType.fromCardTypeDisplayName(createListingDTO.getCardType()));

        Listing listing = factory.createListing(createListingDTO);
        listing.setSeller(seller);

        listingRepository.save(listing);
        System.out.println("Listing created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body("Listing created successfully");
    }

    public ResponseEntity<String> updateListing(UUID listingId, UUID id, UpdateListingDTO updateListingDTO, List<MultipartFile> newImageFiles) {
        System.out.println("Inside updateUser method");

        List<MultipartFile> filteredFiles = newImageFiles.stream()
                .filter(file -> !file.isEmpty())
                .collect(Collectors.toList());

        if (filteredFiles.isEmpty() && updateListingDTO.getImages().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("At least one image must be provided.");
        }

        System.out.println("Images received from DTO:");
        updateListingDTO.getImages().forEach(System.out::println);

        Listing listing = listingRepository.findById(listingId).orElseThrow(() -> new EntityNotFoundException("Listing not found"));

        List<String> changes = new ArrayList<>();

        if (!listing.getSeller().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not allowed to update this listing.");
        }

        if(ChangeTrackerUtil.hasChanged(listing.getListingTitle(), updateListingDTO.getListingTitle())){
            listing.setListingTitle(updateListingDTO.getListingTitle());
            changes.add("Listing Title");
        }

        CardCondition cardCondition = CardCondition.fromCardConditionDisplayName(updateListingDTO.getCardCondition());

        if(ChangeTrackerUtil.hasChanged(listing.getCardCondition(), cardCondition)) {
            listing.setCardCondition(cardCondition);
            changes.add("Card Condition");
        }

        CardType cardType = CardType.fromCardTypeDisplayName(updateListingDTO.getCardType());

        if(ChangeTrackerUtil.hasChanged(listing.getCardType(), cardType)) {
            listing.setCardType(cardType);
            changes.add("Card Type");
        }

        Rarity rarity = Rarity.fromRarityDisplayName(updateListingDTO.getRarity());

        if(ChangeTrackerUtil.hasChanged(listing.getRarity(), rarity)) {
            listing.setRarity(rarity);
            changes.add("Rarity");
        }

        if(ChangeTrackerUtil.hasChanged(listing.getPrice(), updateListingDTO.getPrice())) {
            listing.setPrice(updateListingDTO.getPrice());
            changes.add("Price");
        }

        List<String> finalImageUrls = new ArrayList<>();
        if (updateListingDTO.getImages() != null) {
            finalImageUrls.addAll(updateListingDTO.getImages()); // Retained image URLs
        }

        if (filteredFiles != null && !filteredFiles.isEmpty()) {
            // Upload files to S3 and get URLs
            for (MultipartFile file : filteredFiles) {
                String imageUrl = s3Service.uploadFile(file);
                finalImageUrls.add(imageUrl);
            }
        }

        System.out.println("Final image URLs to be saved:");
        for (String url : finalImageUrls) {
            System.out.println(url);
        }

        if(ChangeTrackerUtil.hasChanged(listing.getImages(),finalImageUrls)) {
            listing.setImages(finalImageUrls);
            changes.add("Images");
        }

        if(ChangeTrackerUtil.hasChanged(listing.getDescription(), updateListingDTO.getDescription())) {
            listing.setDescription(updateListingDTO.getDescription());
            changes.add("Description");
        }

        if(!changes.isEmpty()) {
            listingRepository.save(listing);
            changes.forEach(change -> System.out.println("Changed" + change));
            return ResponseEntity.status(HttpStatus.OK).body("Listing updated successfully: " + String.join(", ", changes));
        } else {
            return ResponseEntity.status(HttpStatus.OK).body("No changes were made.");
        }

    }

    public ResponseEntity<String> updateListingAsSold(UUID listingId) {
        Listing listing = listingRepository.findById(listingId).orElseThrow(() -> new EntityNotFoundException("Listing not found!"));

        listing.setListingStatus(ListingStatus.SOLD);
        listingRepository.save(listing);

        List<CartItem> cartItems = cartItemRepository.findByListing_Id(listingId);

//        for (CartItem cartItem : cartItems) {
//            User user = cartItem.getCart().getUser();  // Get the user who saved the listing
//
//
//            try {
//                // Try real-time notification
//                notificationService.sendRealTimeNotification(user, "Listing: " + listing.getListingTitle() + " by " + listing.getSeller().getUsername() + " is sold out!");
//                notificationService.createNotification(user, "Listing: " + listing.getListingTitle() + " by " + listing.getSeller().getUsername() + " is sold out!");
//            } catch (IOException e) {
//                // WebSocket is closed or user is offline
//                notificationService.createNotification(user, "Listing: " + listing.getListingTitle() + " by " + listing.getSeller().getUsername() + " is sold out!");
//            }
//
//            // Mark the cart item as notified
//            cartItem.setNotifiedStatus();
//            cartItemRepository.save(cartItem);
//        }

        return ResponseEntity.ok("Listing marked as sold");
    }


    public ResponseEntity<String> deleteListing(UUID listingId, UUID id) {
        Listing listing = listingRepository.findById(listingId).orElseThrow(() -> new EntityNotFoundException("Listing not found"));

        if (!listing.getSeller().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not allowed to delete this listing.");
        }

        listing.setListingStatus(ListingStatus.DELETED);
//        listingRepository.delete(listing);
        return ResponseEntity.status(HttpStatus.OK).body("Listing successfully soft deleted");
    }

//    public GetListingsByUserDTO getListingsBySearchFilter(Map<String, String> searchCriteria) {
//        User user = userRepository.findByUsernameIgnoreCase(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
//        List<Listing> listings = listingRepository.findAllBySeller_Id(user.getId());
//
//        GetUserDetailsDTO userDetailsDTO = new GetUserDetailsDTO(user);
//            List<GetListingSummaryDTO> listingSummariesDTOs = listings.stream()
//                .map(GetListingSummaryDTO::new)
//                .toList();
//
//        return new GetListingsByUserDTO(userDetailsDTO.getUsername(), userDetailsDTO.getLocation(), listingSummariesDTOs);
//    }

    public GetListingsDTO getListings(@RequestBody GetListingFilterDTO filter, UUID userId) {

        Page<Listing> listingsPage = listingSearchService.searchListings(filter, userId);

        Set<UUID> cartListingIds = filter.isExcludeCurrentUser()
                ? cartService.getCartListingIds(userId)
                : Collections.emptySet();

        List<GetListingSummaryDTO> listingSummaries = listingsPage.getContent().stream()
                .map(listing -> {
                    boolean isInCart = cartListingIds.contains(listing.getId());

                    // Only set `isInCart` when it's not the user's own listing (exclude current user's listings)
                    if (filter.isExcludeCurrentUser() && listing.getSeller().getId().equals(userId)) {
                        isInCart = false; // Don't set `isInCart` for the current user's own listings
                    }

                    return new GetListingSummaryDTO(listing, isInCart); // Create DTO with isInCart field
                })
                .collect(Collectors.toList());

        GetListingsDTO getListingsDTO = new GetListingsDTO();
        getListingsDTO.setTotalElements(listingsPage.getTotalElements());
        getListingsDTO.setTotalPages(listingsPage.getTotalPages());
        getListingsDTO.setCurrentPage(listingsPage.getNumber());
        getListingsDTO.setPageSize(listingsPage.getSize());
        getListingsDTO.setListings(listingSummaries);

        return getListingsDTO;
    }

    public GetListingDetailsDTO getListingDetails(UUID listingId) {
        Listing listing = listingRepository.findById(listingId).orElseThrow(() -> new EntityNotFoundException("Listing not found"));

        return new GetListingDetailsDTO(listing);
    }

    private ListingFactory getFactoryByCardType(CardType cardType) {
        return switch (cardType) {
            case POKEMON_CARD -> new PokemonCardListingFactory();
            case TRAINER_CARD -> new TrainerCardListingFactory();
            default -> throw new IllegalArgumentException("Unsupported card type: " + cardType);
        };
    }


}
