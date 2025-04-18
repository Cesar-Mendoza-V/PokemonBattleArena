package com.backend.pokemon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a user's inventory item.
 * Maps to the 'user_inventory' table in the database.
 */
@Entity
@Table(name = "user_inventory")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "item_data", nullable = false, columnDefinition = "jsonb")
    private String itemData;  // JSONB data as String

    @Column
    private Integer quantity;

    @PrePersist
    protected void onCreate() {
        if (quantity == null) quantity = 1;
    }
}
