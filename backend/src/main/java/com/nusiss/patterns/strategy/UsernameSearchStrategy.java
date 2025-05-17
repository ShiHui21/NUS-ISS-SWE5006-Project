package com.nusiss.patterns.strategy;

import com.nusiss.dto.GetListingFilterDTO;
import com.nusiss.entity.Listing;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;

public class UsernameSearchStrategy implements SearchStrategy {

    @Override
    public Specification<Listing> searchSpecifications(GetListingFilterDTO getListingFilterDTO) {
        String username = getListingFilterDTO.getUsername();

        // Initialize with an empty specification (i.e., always true)
        Specification<Listing> spec = Specification.where(null);

        if (username != null) {
            spec = spec.and((root, query, builder) -> builder.equal(root.get("seller").get("username"), username));
        }
        return spec;
    }
}
