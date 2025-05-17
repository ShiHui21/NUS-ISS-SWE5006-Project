package com.nusiss.patterns.factory;

import com.nusiss.dto.CreateListingDTO;
import com.nusiss.dto.UpdateListingDTO;
import com.nusiss.entity.Listing;
import org.springframework.boot.autoconfigure.amqp.RabbitStreamTemplateConfigurer;

import java.util.UUID;

public abstract class ListingFactory {

    public abstract Listing createListing(CreateListingDTO createListingDTO);

}
