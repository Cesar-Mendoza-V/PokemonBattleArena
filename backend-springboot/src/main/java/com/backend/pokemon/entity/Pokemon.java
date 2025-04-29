package com.backend.pokemon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a Pokemon in the system.
 * 
 * What is this class? Think of it like a digital Pokédex entry for each Pokémon.
 * This class now stores Pokemon data in a simplified structure with just an ID
 * and all data stored in a single JSONB field for better performance and flexibility.
 * 
 * This information is stored in the 'pokemon' table in the database.
 */
@Entity
@Table(name = "pokemon") 
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pokemon {

    @Id 
    private Integer id; // The unique Pokémon number (same as in the official Pokédex)

    @Column(columnDefinition = "jsonb")
    private String data; // All Pokémon data stored as a single JSON object
}
