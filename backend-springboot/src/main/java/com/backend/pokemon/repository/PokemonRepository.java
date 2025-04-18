package com.backend.pokemon.repository;

import com.backend.pokemon.entity.Pokemon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Pokemon entity operations.
 */
@Repository
public interface PokemonRepository extends JpaRepository<Pokemon, Integer> {
    
    Optional<Pokemon> findByName(String name);
    
    @Query(value = "SELECT * FROM pokemon WHERE types @> ?1::jsonb", nativeQuery = true)
    List<Pokemon> findByType(String typeJson);
    
    @Query(value = "SELECT * FROM pokemon ORDER BY RANDOM() LIMIT ?1", nativeQuery = true)
    List<Pokemon> findRandomPokemon(int limit);
}
