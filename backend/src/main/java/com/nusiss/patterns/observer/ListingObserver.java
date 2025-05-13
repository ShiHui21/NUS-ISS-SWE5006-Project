package com.nusiss.patterns.observer;

import com.nusiss.entity.Listing;

public interface ListingObserver {
    void onListingSold(Listing listing);
}
