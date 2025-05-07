package com.nusiss.service;

import com.nusiss.dto.GetCartItemSummaryDTO;
import com.nusiss.dto.GetCartItemsDTO;
import com.nusiss.entity.Cart;
import com.nusiss.entity.CartItem;
import com.nusiss.entity.Listing;
import com.nusiss.entity.User;
import com.nusiss.repository.CartRepository;
import com.nusiss.repository.ListingRepository;
import com.nusiss.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, ListingRepository listingRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
    }

    public ResponseEntity<String> addCartItem(UUID listingId, UUID userId) {
        Listing listing = listingRepository.findById(listingId).orElseThrow(() -> new EntityNotFoundException("Listing not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser_Id(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        List<CartItem> cartItems = cart.getItems();

        for(CartItem item : cartItems) {
            if(item.getListing().getId().equals(listingId)) {
                return ResponseEntity.status(HttpStatus.FOUND).body("Listing is already in cart");
            }
        }

        CartItem cartItem = new CartItem();
        cartItem.setListing(listing);
        cartItem.setCart(cart);
        cartItems.add(cartItem);

        cartRepository.save(cart);

        return ResponseEntity.status(HttpStatus.CREATED).body("Successfully added to wishlist");
    }

    public ResponseEntity<String> deleteCartItem(UUID listingId, UUID userId) {
        Listing listing = listingRepository.findById(listingId).orElseThrow(() -> new EntityNotFoundException("Listing is not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser_Id(userId).orElseThrow(() -> new EntityNotFoundException("Cart is not found"));

        List<CartItem> cartItems = cart.getItems();
        CartItem toRemove = null;

        for(CartItem item : cartItems) {
            if (item.getListing().getId().equals(listingId)) {
                toRemove = item;
                break;
            }
        }
        if (toRemove != null) {
            cartItems.remove(toRemove);
            cartRepository.save(cart); // cascade should handle deletion of CartItem
            return ResponseEntity.status(HttpStatus.OK).body("Listing has been removed from the cart.");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Listing is not found in Cart item");
    }

    public List<GetCartItemsDTO> getCartItems(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser_Id(userId).orElseThrow(() -> new EntityNotFoundException("Cart is not found"));

        List<CartItem> cartItems = cart.getItems();

        Map<User, List<CartItem>> cartItemsMapping = cartItems.stream()
                .collect(Collectors.groupingBy(cartItem -> cartItem.getListing().getSeller()));

        List<GetCartItemsDTO> cartItemsResult = cartItemsMapping.entrySet().stream().map( entry -> { User seller = entry.getKey();
            List<GetCartItemSummaryDTO> cartItemSummary = entry.getValue().stream().map(cartItem -> {
                Listing listing = cartItem.getListing();
                GetCartItemSummaryDTO cartItemDTO = new GetCartItemSummaryDTO();
                cartItemDTO.setId(listing.getId());
                cartItemDTO.setListingTitle(listing.getListingTitle());
                cartItemDTO.setMainImage(listing.getImages().isEmpty() ? null : listing.getImages().get(0));
                cartItemDTO.setPrice(listing.getPrice());
                cartItemDTO.setCardCondition(listing.getCardCondition().getCardConditionDisplayName());
                cartItemDTO.setRarity(listing.getRarity().getRarityDisplayName());
                cartItemDTO.setListingStatus(listing.getListingStatus().getListingStatusDisplayName());
                return cartItemDTO;
            }).collect(Collectors.toList());

            GetCartItemsDTO cartItemsDTO = new GetCartItemsDTO();
            cartItemsDTO.setItems(cartItemSummary);
            cartItemsDTO.setSellerName(seller.getUsername());
            return cartItemsDTO;
        }).collect(Collectors.toList());

        return cartItemsResult;
    }

    public Set<UUID> getCartListingIds(UUID userId) {
        Cart cart = cartRepository.findByUser_Id(userId).orElseThrow(() -> new EntityNotFoundException("Cart is not found"));

        List<CartItem> cartItems = cart.getItems();

        return cartItems.stream()
                .map(cartItem -> cartItem.getListing().getId())  // Get the UUID from the Listing of each CartItem
                .collect(Collectors.toSet());  // Collect them into a Set of UUIDs
    }
}
