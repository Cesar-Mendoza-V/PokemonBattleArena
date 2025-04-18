package com.backend.pokemon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a Pokemon in the system.
 * Maps to the 'pokemon' table in the database.
 */
@Entity
@Table(name = "pokemon")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pokemon {

    @Id
    private Integer id;  // No es autogenerado, corresponde al ID nacional del Pokémon

    @Column(nullable = false)
    private String name;

    @Column(name = "api_data", nullable = false, columnDefinition = "jsonb")
    private String apiData;  // JSONB data as String

    @Column(columnDefinition = "jsonb")
    private String sprites;  // JSONB data as String

    @Column(nullable = false, columnDefinition = "jsonb")
    private String types;  // JSONB data as String

    @Column(nullable = false, columnDefinition = "jsonb")
    private String stats;  // JSONB data as String

    @Column(columnDefinition = "jsonb")
    private String abilities;  // JSONB data as String

    @Column(columnDefinition = "jsonb")
    private String moves;  // JSONB data as String

    @Column(name = "species_data", columnDefinition = "jsonb")
    private String speciesData;  // JSONB data as String

    @Column(name = "evolution_chain", columnDefinition = "jsonb")
    private String evolutionChain;  // JSONB data as String

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
