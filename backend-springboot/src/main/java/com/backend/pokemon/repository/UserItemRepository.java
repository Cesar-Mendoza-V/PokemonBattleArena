package com.backend.pokemon.repository;

import com.backend.pokemon.entity.EvolutionItem;
import com.backend.pokemon.entity.User;
import com.backend.pokemon.entity.UserItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para operaciones de entidad UserItem.
 * 
 * Este repositorio permite buscar y gestionar los ítems de evolución 
 * que poseen los usuarios en el juego.
 */
@Repository
public interface UserItemRepository extends JpaRepository<UserItem, Integer> {
    /**
     * Encuentra todos los ítems que posee un usuario específico.
     */
    List<UserItem> findByUser(User user);
    
    /**
     * Encuentra un ítem específico en la colección de un usuario.
     */
    Optional<UserItem> findByUserAndItem(User user, EvolutionItem item);
}