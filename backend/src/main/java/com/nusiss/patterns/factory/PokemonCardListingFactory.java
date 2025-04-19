package com.nusiss.patterns.factory;

import com.nusiss.dto.ListingCreateDTO;
import com.nusiss.entity.Listing;
import com.nusiss.entity.User;

import java.math.BigDecimal;
import java.util.UUID;

public class PokemonCardListingFactory extends ListingFactory{

    @Override
    public Listing createListing(ListingCreateDTO listingCreateDTO, UUID id) {

        BigDecimal sellingFeeRate = getPlatformFeeRate(listingCreateDTO.getRarity().getRarityDisplayName());
        BigDecimal totalPrice = listingCreateDTO.getPrice();
        BigDecimal sellerToReceive = listingCreateDTO.getPrice().subtract(sellingFeeRate);

        Listing listing = new Listing();

        listing.setListingTitle(listingCreateDTO.getListingTitle());
        listing.setCondition(listingCreateDTO.getCardCondition());
        listing.setCardType(listingCreateDTO.getCardType());
        listing.setRarity(listingCreateDTO.getRarity());
        listing.setPrice(totalPrice); // Total price includes platform fee
        listing.setImages(listingCreateDTO.getImages());
        listing.setDescription(listingCreateDTO.getDescription());
        listing.setCardType(listingCreateDTO.getCardType());
        listing.setRarity(listingCreateDTO.getRarity());
        listing.setStatus("ACTIVE");

        return listing;
    }

    public BigDecimal getPlatformFeeRate(String rarity) {

        return switch (rarity) {
            case "Illustration Rare" -> BigDecimal.valueOf(0.025);
            case "Special Illustration Rare" -> BigDecimal.valueOf(0.05);
            case "Hyper Rare" -> BigDecimal.valueOf(0.10);
            default -> BigDecimal.valueOf(0.00); // Default to 0% if rarity is unknown
        };
    }
}
