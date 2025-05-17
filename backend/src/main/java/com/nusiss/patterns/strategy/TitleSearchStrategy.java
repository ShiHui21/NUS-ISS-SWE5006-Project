package com.nusiss.patterns.strategy;

import com.nusiss.dto.GetListingFilterDTO;
import com.nusiss.entity.Listing;
import org.springframework.data.jpa.domain.Specification;

public class TitleSearchStrategy implements SearchStrategy {

    @Override
    public Specification<Listing> searchSpecifications(GetListingFilterDTO getListingFilterDTO) {
        String listingTitle = getListingFilterDTO.getListingTitle();

        // Initialize with an empty specification (i.e., always true)
        Specification<Listing> spec = Specification.where(null);

        if (listingTitle != null) {
            spec = spec.and((root, query, builder) -> builder.like(builder.lower(root.get("listingTitle")), "%" + listingTitle.toLowerCase() + "%"));
        }
        return spec;
    }
}
