package com.backend.pokemon.repository;

import com.backend.pokemon.entity.User;
import com.backend.pokemon.entity.UserInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for UserInventory entity operations.
 */
@Repository
public interface UserInventoryRepository extends JpaRepository<UserInventory, Long> {
    
    List<UserInventory> findByUser(User user);
    
    Optional<UserInventory> findByUserAndItemName(User user, String itemName);
}
