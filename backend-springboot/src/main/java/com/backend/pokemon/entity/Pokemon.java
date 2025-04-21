package com.backend.pokemon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a Pokemon in the system.
 * 
 * What is this class? Think of it like a digital Pokédex entry for each Pokémon.
 * Just as a Pokédex stores detailed information about each Pokémon (like its type,
 * abilities, and stats), this class stores all that data in our database.
 * 
 * This information is stored in the 'pokemon' table in the database.
 */
@Entity // Tells Spring this class represents a table in the database
@Table(name = "pokemon") // Specifies the name of the database table
@Data // Automatically creates getters, setters, equals, hashCode methods
@Builder // Makes it easy to create Pokemon objects step by step
@NoArgsConstructor // Creates an empty constructor (required for JPA)
@AllArgsConstructor // Creates a constructor with all fields
public class Pokemon {

    @Id // Marks this as the primary key (unique identifier)
    private Integer id; // The unique Pokémon number (same as in the official Pokédex)

    @Column(nullable = false) // This column cannot be empty in the database
    private String name; // The Pokémon's name (like "Pikachu" or "Charizard")

    @Column(name = "api_data", nullable = false, columnDefinition = "jsonb") // Stores JSON data from the Pokémon API
    private String apiData; // The complete raw data from the Pokémon API as JSON

    @Column(columnDefinition = "jsonb") // This column stores JSON data
    private String sprites; // URLs to the Pokémon's images (front, back, shiny versions, etc.)

    @Column(nullable = false, columnDefinition = "jsonb")
    private String types; // The Pokémon's types (like Electric, Fire, Water, etc.) stored as JSON

    @Column(nullable = false, columnDefinition = "jsonb")
    private String stats; // The Pokémon's base stats (HP, Attack, Defense, etc.) stored as JSON  

    @Column(columnDefinition = "jsonb")
    private String abilities; // The Pokémon's special abilities stored as JSON  

    @Column(columnDefinition = "jsonb")
    private String moves; // All moves the Pokémon can learn stored as JSON  

    @Column(name = "species_data", columnDefinition = "jsonb")
    private String speciesData; // Information about the Pokémon's species stored as JSON

    @Column(name = "evolution_chain", columnDefinition = "jsonb")
    private String evolutionChain; // How this Pokémon evolves stored as JSON  

    @Column(name = "created_at")
    private LocalDateTime createdAt; // When this Pokémon was first added to our database

    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // When this Pokémon's information was last updated

    @PrePersist // This method runs automatically before saving a new Pokémon to the database
    protected void onCreate() {
        createdAt = LocalDateTime.now(); // Set the current time as creation time
        updatedAt = LocalDateTime.now(); // Set the current time as the last update time
    }

    @PreUpdate // This method runs automatically before updating an existing Pokémon
    protected void onUpdate() {
        updatedAt = LocalDateTime.now(); // Update the last modified time
    }
}
