package com.nusiss.patterns.strategy;

import com.nusiss.dto.GetListingFilterDTO;
import com.nusiss.entity.Listing;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public interface SearchStrategy {
    Specification<Listing> searchSpecifications(GetListingFilterDTO getListingFilterDTO);
}
