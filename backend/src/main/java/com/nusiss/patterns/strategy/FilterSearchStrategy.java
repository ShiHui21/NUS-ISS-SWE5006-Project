package com.nusiss.patterns.strategy;

import com.nusiss.dto.GetListingFilterDTO;
import com.nusiss.entity.Listing;
import com.nusiss.enums.*;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class FilterSearchStrategy implements SearchStrategy {

    @Override
    public Specification<Listing> searchSpecifications(GetListingFilterDTO getListingFilterDTO) {
        BigDecimal minPrice = getListingFilterDTO.getMinPrice() != null ? getListingFilterDTO.getMinPrice() : null;
        BigDecimal maxPrice = getListingFilterDTO.getMaxPrice() != null ? getListingFilterDTO.getMaxPrice() : null;
        List<String> conditionStrings = getListingFilterDTO.getConditions();
        List<String> rarityStrings = getListingFilterDTO.getRarities();
        List<String> statusStrings = getListingFilterDTO.getListingStatuses();
        List<String> regionStrings = getListingFilterDTO.getRegions();
        List<String> cardTypeStrings = getListingFilterDTO.getCardTypes();

        // Initialize with an empty specification (i.e., always true)
        Specification<Listing> spec = Specification.where(null);

        // Apply price range filter if provided
        if (minPrice != null) {
            spec = spec.and((root, query, builder) -> builder.greaterThanOrEqualTo(root.get("price"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, builder) -> builder.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        // Apply condition filter if provided
        if (conditionStrings != null && !conditionStrings.isEmpty()) {
            List<CardCondition> conditions = new ArrayList<>();
            for(String cond: conditionStrings) {
                try {
                    CardCondition cardCondition = CardCondition.fromCardConditionDisplayName(cond.trim());
                    conditions.add(cardCondition);
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid card condition ignored: " + cond);
                }
            }

            // Debug log for parsed conditions
            System.out.println("Parsed conditions: " + conditions);

            if (!conditions.isEmpty()) {
                System.out.println("Filtering card conditions: " + conditions);
                spec = spec.and((root, query, builder) -> root.get("cardCondition").in(conditions));
            }
        }

        if (rarityStrings != null && !rarityStrings.isEmpty()) {
            List<Rarity> rarities = new ArrayList<>();
            for(String rare: rarityStrings) {
                try {
                    Rarity rarityType = Rarity.fromRarityDisplayName(rare.trim());
                    rarities.add(rarityType);
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid rarity type ignored: " + rare);
                }
            }

            if (!rarities.isEmpty()) {
                System.out.println("Filtering rarity: " + rarities);
                spec = spec.and((root, query, builder) -> root.get("rarity").in(rarities));
            }
        }

        // Apply listing status filter if provided
        if (statusStrings != null && !statusStrings.isEmpty()) {
            List<ListingStatus> listingStatuses = new ArrayList<>();
            for(String state : statusStrings) {
                try {
                    ListingStatus listingStatus = ListingStatus.fromListingStatusDisplayName(state.trim());
                    listingStatuses.add(listingStatus);
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid status type ignored: " + state);
                }
            }

            if (!listingStatuses.isEmpty()) {
                System.out.println("Filtering status: " + listingStatuses);
                spec = spec.and((root, query, builder) -> root.get("listingStatus").in(listingStatuses));
            }
        }

        // Apply listing status filter if provided
        if (cardTypeStrings != null && !cardTypeStrings.isEmpty()) {
            List<CardType> cardTypes = new ArrayList<>();
            for(String card : cardTypeStrings) {
                try {
                    CardType cardType = CardType.fromCardTypeDisplayName(card.trim());
                    cardTypes.add(cardType);
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid card type ignored: " + card);
                }
            }

            if (!cardTypes.isEmpty()) {
                System.out.println("Filtering card Type: " + cardTypes);
                spec = spec.and((root, query, builder) -> root.get("cardType").in(cardTypes));
            }
        }


        // Apply region filter if provided
        if (regionStrings != null && !regionStrings.isEmpty()) {
            List<Region> regions = new ArrayList<>();
            for(String reg : regionStrings) {
                try {
                    Region regiontype = Region.fromRegionDisplayName(reg.trim());
                    regions.add(regiontype);
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid status type ignored: " + reg);
                }
            }

            if (!regions.isEmpty()) {
                System.out.println("Filtering rarity: " + regions);
                spec = spec.and((root, query, builder) -> root.get("seller").get("region").in(regions));
            }
        }

        return spec;
    }
}
