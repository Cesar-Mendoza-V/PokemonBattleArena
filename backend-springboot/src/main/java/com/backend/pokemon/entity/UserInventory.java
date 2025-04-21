package com.backend.pokemon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a user's inventory item.
 * 
 * What is this class? Think of it like the digital version of a player's backpack.
 * Just as a Pokémon trainer might carry potions, pokéballs, and other items,
 * this class keeps track of all the virtual items a user has collected in the game.
 * 
 * This information is stored in the 'user_inventory' table in the database.
 */
@Entity // Tells Spring this class represents a table in the database
@Table(name = "user_inventory") // Specifies the name of the database table
@Data // Automatically creates getters, setters, equals, hashCode methods
@Builder // Makes it easy to create UserInventory objects step by step
@NoArgsConstructor // Creates an empty constructor (required for JPA)
@AllArgsConstructor // Creates a constructor with all fields
public class UserInventory {

    @Id // Marks this as the primary key (unique identifier)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates unique IDs (like auto-numbering)
    private Long id; // The unique number for each inventory item entry

    @ManyToOne(fetch = FetchType.LAZY) // Many inventory items can belong to the same user
    @JoinColumn(name = "user_id") // The column that links to the users table
    private User user; // The user who owns this inventory item

    @Column(name = "item_name", nullable = false) // Cannot be empty
    private String itemName; // The name of the item (like "Potion" or "Ultra Ball")

    @Column(name = "item_data", nullable = false, columnDefinition = "jsonb") // Stores JSON data about the item
    private String itemData;  // All the details about the item (effects, description, icon, etc.) stored as JSON

    @Column
    private Integer quantity; // How many of this item the user has (for stackable items)

    @PrePersist // This method runs automatically before saving a new inventory item to the database
    protected void onCreate() {
        if (quantity == null) quantity = 1; // If no quantity was specified, default to 1
    }
}
