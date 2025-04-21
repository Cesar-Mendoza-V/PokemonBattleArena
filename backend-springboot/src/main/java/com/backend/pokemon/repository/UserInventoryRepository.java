package com.backend.pokemon.repository;

import com.backend.pokemon.entity.User;
import com.backend.pokemon.entity.UserInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for UserInventory entity operations.
 * 
 * What is this interface? Think of it like a digital backpack manager that keeps track
 * of all the items each trainer owns in the game.
 * 
 * Just as a real backpack holds your potions, pokéballs, and other items,
 * this repository helps the application find, add, update, and remove items
 * from each user's virtual inventory in the database.
 */
@Repository // Marks this as a repository that Spring should manage
public interface UserInventoryRepository extends JpaRepository<UserInventory, Long> {
    
    /**
     * Find all inventory items owned by a specific user.
     * 
     * Like asking "Show me everything in Ash's backpack".
     */
    List<UserInventory> findByUser(User user);
    
    /**
     * Find a specific item in a user's inventory by name.
     * 
     * Like asking "Does Ash have any Super Potions in his backpack?"
     * Returns the item if found, or empty if the user doesn't have that item.
     */
    Optional<UserInventory> findByUserAndItemName(User user, String itemName);
}
