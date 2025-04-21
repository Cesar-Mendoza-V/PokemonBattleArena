package com.backend.pokemon.repository;

import com.backend.pokemon.entity.User;
import com.backend.pokemon.entity.UserPokemon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for UserPokemon entity operations.
 * 
 * What is this interface? Think of it like a digital PC storage system from the Pokémon games.
 * 
 * Just as the PC in Pokémon games lets trainers store, organize, and retrieve their 
 * captured Pokémon, this repository helps the application find and manage all the
 * Pokémon that belong to each user in the database.
 */
@Repository // Marks this as a repository that Spring should manage
public interface UserPokemonRepository extends JpaRepository<UserPokemon, Long> {
    
    /**
     * Find all Pokémon owned by a specific user.
     * 
     * Like asking "Show me all Pokémon that Ash has caught".
     */
    List<UserPokemon> findByUser(User user);
    
    /**
     * Find all Pokémon owned by a user, sorted from highest level to lowest.
     * 
     * Like asking "Show me all of Ash's Pokémon, with his strongest ones first".
     */
    List<UserPokemon> findByUserIdOrderByLevelDesc(Long userId);
}
