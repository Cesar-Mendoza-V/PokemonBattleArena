package com.backend.pokemon.repository;

import com.backend.pokemon.entity.PokemonEvolution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface PokemonEvolutionRepository extends JpaRepository<PokemonEvolution, Integer> {
    Optional<PokemonEvolution> findByPokemonId(Integer pokemonId);
    List<PokemonEvolution> findByRequiredItemId(Integer itemId);
}