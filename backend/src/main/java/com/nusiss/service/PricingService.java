package com.nusiss.service;

import com.nusiss.entity.Listing;
import com.nusiss.enums.CardType;
import com.nusiss.enums.Rarity;
import com.nusiss.patterns.factory.ListingFactory;
import com.nusiss.patterns.factory.PokemonCardListingFactory;
import com.nusiss.patterns.factory.TrainerCardListingFactory;

import java.math.BigDecimal;

public class PricingService {

    public BigDecimal GetPricing(Listing listing) {

        return listing.getPrice().subtract(getPlatformFeeRate(listing.getRarity()));
    }

    public BigDecimal getPlatformFeeRate(Rarity rarity) {

        return switch (rarity) {
            case ILLUSTRATION_RARE -> BigDecimal.valueOf(0.025);
            case SPECIAL_ILLUSTRATION_RARE -> BigDecimal.valueOf(0.05);
            case HYPER_RARE -> BigDecimal.valueOf(0.10);
            default -> BigDecimal.valueOf(0.00); // Default to 0% if rarity is unknown
        };
    }


}
