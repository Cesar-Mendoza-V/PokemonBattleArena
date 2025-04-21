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
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(name = "api_data", nullable = false, columnDefinition = "jsonb")
    private String apiData;

    @Column(columnDefinition = "jsonb")
    private String sprites;

    @Column(nullable = false, columnDefinition = "jsonb")
    private String types;

    @Column(nullable = false, columnDefinition = "jsonb")
    private String stats;  

    @Column(columnDefinition = "jsonb")
    private String abilities;  

    @Column(columnDefinition = "jsonb")
    private String moves;  

    @Column(name = "species_data", columnDefinition = "jsonb")
    private String speciesData; 

    @Column(name = "evolution_chain", columnDefinition = "jsonb")
    private String evolutionChain;  

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
