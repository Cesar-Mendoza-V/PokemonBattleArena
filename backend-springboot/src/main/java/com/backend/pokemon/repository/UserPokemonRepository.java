package com.backend.pokemon.repository;

import com.backend.pokemon.entity.User;
import com.backend.pokemon.entity.UserPokemon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for UserPokemon entity operations.
 */
@Repository
public interface UserPokemonRepository extends JpaRepository<UserPokemon, Long> {
    
    List<UserPokemon> findByUser(User user);
    
    List<UserPokemon> findByUserIdOrderByLevelDesc(Long userId);
}
