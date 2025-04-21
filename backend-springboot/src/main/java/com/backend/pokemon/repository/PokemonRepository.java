package com.backend.pokemon.repository;

import com.backend.pokemon.entity.Pokemon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Pokemon entity operations.
 * 
 * What is this interface? Think of it like a digital Pokédex that can search 
 * and retrieve Pokémon information from the database.
 * 
 * Just as a Pokédex lets trainers look up Pokémon by name or type,
 * this repository gives the application special methods to find
 * Pokémon stored in our database using different search criteria.
 */
@Repository // Marks this as a repository that Spring should manage
public interface PokemonRepository extends JpaRepository<Pokemon, Integer> {
    
    /**
     * Find a Pokémon by its name.
     * 
     * Like searching "Pikachu" in a Pokédex and getting its full information.
     */
    Optional<Pokemon> findByName(String name);
    
    /**
     * Find all Pokémon of a specific type.
     * 
     * Like asking a Pokédex "Show me all Electric-type Pokémon".
     * This uses a special PostgreSQL query to search inside the JSON data.
     */
    @Query(value = "SELECT * FROM pokemon WHERE types @> ?1::jsonb", nativeQuery = true)
    List<Pokemon> findByType(String typeJson);
    
    /**
     * Get a random selection of Pokémon.
     * 
     * Like a "surprise me" feature on a Pokédex that shows random entries.
     * Useful for creating random encounters or suggesting Pokémon to users.
     */
    @Query(value = "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT ?1", nativeQuery = true)
    List<Pokemon> findRandomPokemon(int limit);
}
