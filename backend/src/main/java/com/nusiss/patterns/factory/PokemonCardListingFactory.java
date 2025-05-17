package com.nusiss.patterns.factory;

import com.nusiss.dto.CreateListingDTO;
import com.nusiss.entity.Listing;
import com.nusiss.enums.CardCondition;
import com.nusiss.enums.CardType;
import com.nusiss.enums.ListingStatus;
import com.nusiss.enums.Rarity;

import java.math.BigDecimal;

public class PokemonCardListingFactory extends ListingFactory{

//    private PricingService pricingService;
//
//    public PokemonCardListingFactory(PricingService pricingService) {
//        this.pricingService = pricingService;
//    }
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
        listing.setListingStatus(ListingStatus.ACTIVE);

        return listing;
    }

}
