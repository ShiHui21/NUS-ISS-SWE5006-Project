package com.nusiss.patterns.factory;

import com.nusiss.dto.ListingCreateDTO;
import com.nusiss.entity.Listing;

import java.util.UUID;

public abstract class ListingFactory {

    public abstract Listing createListing(ListingCreateDTO listingCreateDTO, UUID id);
}
