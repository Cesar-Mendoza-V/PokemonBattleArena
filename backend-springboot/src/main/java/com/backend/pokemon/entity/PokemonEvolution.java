package com.backend.pokemon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que representa la información de evolución de un Pokémon.
 * 
 * Esta clase define cuándo y cómo puede evolucionar un Pokémon, incluyendo
 * el nivel necesario y si requiere algún ítem específico para la evolución.
 */
@Entity
@Table(name = "pokemon_evolutions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PokemonEvolution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;  // Cambiado de Long a Integer para coincidir con el tipo serial en la BD
    
    @Column(nullable = false)
    private Integer pokemonId;  // Id del Pokémon base
    
    @Column(nullable = false)
    private Integer evolvesToId;  // Id del Pokémon evolucionado
    
    @Column(nullable = false)
    private Integer requiredLevel;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "required_item_id")
    private EvolutionItem requiredItem;  // Puede ser nulo si no requiere item
}