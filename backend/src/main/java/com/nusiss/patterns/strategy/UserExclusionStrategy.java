package com.nusiss.patterns.strategy;

import com.nusiss.dto.GetListingFilterDTO;
import com.nusiss.entity.Listing;
import org.springframework.data.jpa.domain.Specification;

import java.util.Map;
import java.util.UUID;

public class UserExclusionStrategy implements SearchStrategy {

    private final UUID userId;
    private final boolean excludeUser;

    public UserExclusionStrategy(UUID userId, boolean excludeUser) {
        this.userId = userId;
        this.excludeUser = excludeUser;
    }

    @Override
    public Specification<Listing> searchSpecifications(GetListingFilterDTO getListingFilterDTO) {
        if(excludeUser && userId != null) {
            return (root, query, builder) -> builder.notEqual(root.get("seller").get("id"), userId);
        }
        return null;
    }
}
