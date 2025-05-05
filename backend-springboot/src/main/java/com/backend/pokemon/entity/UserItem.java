package com.backend.pokemon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que representa un ítem de evolución que posee un usuario.
 * 
 * Esta clase registra los ítems de evolución específicos que cada entrenador 
 * ha recolectado en el juego y la cantidad que tiene de cada uno.
 */
@Entity
@Table(name = "user_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Cambiado de Long a Integer para coincidir con el tipo serial en la BD
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private EvolutionItem item;
    
    @Column(nullable = false)
    private Integer quantity;
}