package com.nusiss.patterns.strategy;

import com.nusiss.entity.Listing;
import com.nusiss.enums.CardCondition;
import com.nusiss.enums.Rarity;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class FilterSearchStrategy implements SearchStrategy {

    @Override
    public Specification<Listing> searchSpecifications(Map<String, String> params) {
        BigDecimal minPrice = params.containsKey("minPrice") ? new BigDecimal(params.get("minPrice")) : null;
        BigDecimal maxPrice = params.containsKey("maxPrice") ? new BigDecimal(params.get("maxPrice")) : null;
        String condition = params.get("condition");
        String rarity = params.get("rarity");
        String listingStatus = params.get("isSold");

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
        if (condition != null && !condition.isEmpty()) {

            String[] conditionStrings = condition.split(",");
            List<CardCondition> conditions = new ArrayList<>();
            for(String cond: conditionStrings) {
                try {
                    CardCondition cardCondition = CardCondition.fromCardConditionDisplayName(cond.trim());
                    conditions.add(cardCondition);
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid card condition ignored: " + cond);
                }
            }

            if (!conditions.isEmpty()) {
                System.out.println("Filtering card conditions: " + conditions);
                spec = spec.and((root, query, builder) -> root.get("cardCondition").in(conditions));
            }
        }

        if (rarity != null && !rarity.isEmpty()) {

            String[] rarityStrings = rarity.split(",");
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
        if (listingStatus != null) {
            Boolean status = Boolean.parseBoolean(listingStatus);
            spec = spec.and((root, query, builder) -> builder.equal(root.get("isSold"), status));
        }

        return spec;
    }
}
