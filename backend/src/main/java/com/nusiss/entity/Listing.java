package com.nusiss.entity;

import com.nusiss.enums.CardType;
import com.nusiss.enums.CardCondition;
import com.nusiss.enums.Rarity;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Listing {

    @Id
    @JdbcTypeCode(SqlTypes.CHAR)
    @GeneratedValue
    private UUID id;

    private String listingTitle;

    @Enumerated(EnumType.STRING)
    private CardCondition cardCondition;

    @Enumerated(EnumType.STRING)
    private CardType cardType;

    @Enumerated(EnumType.STRING)
    private Rarity rarity;

    private BigDecimal price;

    @ElementCollection
    private List<String> images = new ArrayList<>();

    private String status;

    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User seller;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdOn;

    @PrePersist
    public void prePersist() {
        if (createdOn == null) {
            createdOn = LocalDateTime.now(); // Set the current timestamp
        }
    }

    public UUID getId() { return this.id; }

    public String getListingTitle() { return listingTitle; }

    public void setListingTitle(String listingTitle) { this.listingTitle = listingTitle; }

    public CardCondition getCardCondition() { return cardCondition; }

    public void setCardCondition(CardCondition cardCondition) { this.cardCondition = cardCondition; }

    public CardType getCardType() { return cardType; }

    public void setCardType(CardType cardType) { this.cardType = cardType; }

    public Rarity getRarity() { return rarity; }

    public void setRarity(Rarity rarity) { this.rarity = rarity; }

    public BigDecimal getPrice() { return price; }

    public void setPrice(BigDecimal price) {this.price = price; }

    public List<String> getImages() { return images; }

    public void setImages(List<String> images) { this.images = images; }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public User getSeller() { return seller; }

    public void setSeller(User seller) { this.seller = seller; }

    public LocalDateTime getCreatedOn() { return createdOn; }
}
