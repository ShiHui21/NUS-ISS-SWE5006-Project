package com.nusiss.service;

import com.nusiss.dto.*;
import com.nusiss.entity.Listing;
import com.nusiss.entity.User;
import com.nusiss.enums.CardCondition;
import com.nusiss.enums.CardType;
import com.nusiss.enums.Rarity;
import com.nusiss.exception.UserNotFoundException;
import com.nusiss.patterns.factory.ListingFactory;
import com.nusiss.patterns.factory.PokemonCardListingFactory;
import com.nusiss.patterns.factory.TrainerCardListingFactory;
import com.nusiss.patterns.strategy.FilterSearchStrategy;
import com.nusiss.patterns.strategy.UsernameSearchStrategy;
import com.nusiss.repository.ListingRepository;
import com.nusiss.repository.UserRepository;
import com.nusiss.util.ChangeTrackerUtil;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.data.jpa.repository.query.KeysetScrollSpecification.createSort;

@Service
public class ListingService {

    private final UserRepository userRepository;
    private final ListingRepository listingRepository;

    public ListingService(UserRepository userRepository, ListingRepository listingRepository) {
        this.userRepository = userRepository;
        this.listingRepository = listingRepository;
    }

    public ResponseEntity<String> createListing(UUID id, CreateListingDTO createListingDTO) {
        System.out.println("Inside createUser method");

        User seller = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));

        ListingFactory factory = getFactoryByCardType(CardType.fromCardTypeDisplayName(createListingDTO.getCardType()));

        Listing listing = factory.createListing(createListingDTO);
        listing.setSeller(seller);

        listingRepository.save(listing);
        System.out.println("Listing created successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body("Listing created successfully");
    }

    public ResponseEntity<String> updateListing(UUID listingId, UUID id, UpdateListingDTO updateListingDTO) {
        System.out.println("Inside updateUser method");
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

        if(ChangeTrackerUtil.hasChanged(listing.getImages(),updateListingDTO.getImages())) {
            listing.setImages(updateListingDTO.getImages());
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

    public ResponseEntity<String> deleteListing(UUID listingId, UUID id) {
        Listing listing = listingRepository.findById(listingId).orElseThrow(() -> new EntityNotFoundException("Listing not found"));

        if (!listing.getSeller().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not allowed to delete this listing.");
        }
        listingRepository.delete(listing);
        return ResponseEntity.status(HttpStatus.OK).body("Listing successfully deleted");
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

    public GetListingsBySummaryDTO  getListings(Map<String, String> params, int page, int size) {

        Specification<Listing> spec = Specification.where(null);

        // Apply the username search strategy if provided
        if (params.containsKey("username")) {
            spec = spec.and(new UsernameSearchStrategy().searchSpecifications(params));
        }

        if (params.containsKey("minPrice") || params.containsKey("maxPrice") ||
                params.containsKey("condition") || params.containsKey("listingStatus")) {
            spec = spec.and(new FilterSearchStrategy().searchSpecifications(params));
        }

        String sortBy = params.getOrDefault("sortBy", "createdOn");
        String sortOrder = params.getOrDefault("sortOrder", "asc");
        int currPage = Integer.parseInt(params.getOrDefault("page", "0"));
        int currSize = Integer.parseInt(params.getOrDefault("size", "10"));
        Sort sort = createSort(sortBy, sortOrder);

        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<Listing> listingsPage = listingRepository.findAll(spec, pageRequest);

        List<GetListingSummaryDTO> listingSummaries = listingsPage.getContent().stream()
                .map(listing -> new GetListingSummaryDTO(listing))
                .collect(Collectors.toList());

        GetListingsBySummaryDTO getListingsBySummaryDTO = new GetListingsBySummaryDTO();
        getListingsBySummaryDTO.setListings(listingSummaries);
        getListingsBySummaryDTO.setTotalElements(listingsPage.getTotalElements());
        getListingsBySummaryDTO.setTotalPages(listingsPage.getTotalPages());
        getListingsBySummaryDTO.setCurrentPage(listingsPage.getNumber());
        getListingsBySummaryDTO.setPageSize(listingsPage.getSize());

        return getListingsBySummaryDTO;
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

    private Sort createSort(String sortBy, String sortOrder) {
        if (sortBy == null || sortBy.isEmpty()) {
            sortBy = "createdOn"; // Default to sorting by createdDate
        }

        if (sortOrder == null || sortOrder.equalsIgnoreCase("asc")) {
            return sortBy.equalsIgnoreCase("price") ? Sort.by(Sort.Order.asc("price"))
                    : Sort.by(Sort.Order.asc("createdOn"));
        } else {
            return sortBy.equalsIgnoreCase("price") ? Sort.by(Sort.Order.desc("price"))
                    : Sort.by(Sort.Order.desc("createdOn"));
        }
    }
}
