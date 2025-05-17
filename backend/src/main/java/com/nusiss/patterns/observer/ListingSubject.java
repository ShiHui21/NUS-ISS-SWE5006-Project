package com.nusiss.patterns.observer;

import com.nusiss.entity.Listing;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ListingSubject {
    private final List<ListingObserver> observers = new ArrayList<>();

    public void addObserver(ListingObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(ListingObserver observer) {
        observers.remove(observer);
    }

    public void notifyObservers(Listing listing) {
        for (ListingObserver observer : observers) {
            observer.onListingSold(listing);
        }
    }
}
