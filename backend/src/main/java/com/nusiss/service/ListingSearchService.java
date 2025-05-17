package com.nusiss.service;

import com.nusiss.dto.GetListingFilterDTO;
import com.nusiss.entity.Listing;
import com.nusiss.patterns.strategy.*;
import com.nusiss.repository.ListingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ListingSearchService {

    private final ListingRepository listingRepository;

    public ListingSearchService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    public Page<Listing> searchListings(GetListingFilterDTO filter, UUID userId) {
        List<SearchStrategy> strategies = new ArrayList<>();

        if (filter.getUsername() != null) {
            strategies.add(new UsernameSearchStrategy());
        }

        if (filter.getListingTitle() != null) {
            strategies.add(new TitleSearchStrategy());
        }

        if (filter.getMinPrice() != null || filter.getMaxPrice() != null ||
                filter.getConditions() != null || filter.getListingStatuses() != null ||
                filter.getRarities() != null || filter.getRegions() != null) { // You create this helper method
            strategies.add(new FilterSearchStrategy());
        }

        strategies.add(new UserExclusionStrategy(userId, filter.isExcludeCurrentUser()));

        Specification<Listing> spec = Specification.where(null);
        for (SearchStrategy strategy : strategies) {
            Specification<Listing> strategySpec = strategy.searchSpecifications(filter);
            if (strategySpec != null) {
                spec = spec.and(strategySpec);
            }
        }

        Sort sort = createSort(filter.getSortBy(), filter.getSortOrder());
        PageRequest pageRequest = PageRequest.of(
                Integer.parseInt(Optional.ofNullable(filter.getPage()).orElse("0")),
                Integer.parseInt(Optional.ofNullable(filter.getSize()).orElse("100")),
                sort
        );

        return listingRepository.findAll(spec, pageRequest);
    }

    private Sort createSort(String sortBy, String sortOrder) {
        if (sortBy == null || sortBy.isEmpty()) {
            sortBy = "createdOn"; // Default
        }

        if (sortOrder == null || sortOrder.isEmpty()) {
            sortOrder = "asc";
        }

        String sortField = switch (sortBy.toLowerCase()) {
            case "price" -> "price";
            case "rarity" -> "rarityPriority";
            case "condition" -> "conditionPriority";
            default -> "createdOn";
        };

        Sort.Direction direction = sortOrder.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;

        return Sort.by(direction, sortField);
    }
}
