package com.backend.pokemon.repository;

import com.backend.pokemon.entity.EvolutionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EvolutionItemRepository extends JpaRepository<EvolutionItem, Integer> {

    Optional<EvolutionItem> findByName(String name);
}