package com.nusiss.patterns.factory;

import com.nusiss.dto.CreateListingDTO;
import com.nusiss.dto.UpdateListingDTO;
import com.nusiss.entity.Listing;
import com.nusiss.enums.CardCondition;
import com.nusiss.enums.CardType;
import com.nusiss.enums.Rarity;

import java.math.BigDecimal;

public class TrainerCardListingFactory extends ListingFactory {

    @Override
    public Listing createListing(CreateListingDTO createListingDTO) {

        Listing listing = new Listing();

        listing.setListingTitle(createListingDTO.getListingTitle());
        listing.setCardCondition(CardCondition.fromCardConditionDisplayName(createListingDTO.getCardCondition()));
        listing.setCardType(CardType.fromCardTypeDisplayName(createListingDTO.getCardType()));
        listing.setRarity(Rarity.fromRarityDisplayName(createListingDTO.getRarity()));
        listing.setPrice(createListingDTO.getPrice()); // Total price includes platform fee
        listing.setImages(createListingDTO.getImages());
        listing.setDescription(createListingDTO.getDescription());
        listing.setStatus("AVAILABLE");

        return listing;
    }

}
