package com.backend.pokemon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Entity representing a Pokemon owned by a user.
 * 
 * What is this class? Think of it like a digital Pokémon that you've caught in
 * the game.
 * Just as a real Pokémon trainer would have their own unique Pokémon with
 * nicknames,
 * levels, and special moves, this class tracks all the details about each
 * Pokémon
 * that a user has captured in the game.
 * 
 * This information is stored in the 'user_pokemon' table in the database.
 */
@Entity // Tells Spring this class represents a table in the database
@Table(name = "user_pokemon") // Specifies the name of the database table
@Data // Automatically creates getters, setters, equals, hashCode methods
@Builder // Makes it easy to create UserPokemon objects step by step
@NoArgsConstructor // Creates an empty constructor (required for JPA)
@AllArgsConstructor // Creates a constructor with all fields
public class UserPokemon {

    @Id // Marks this as the primary key (unique identifier)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates unique IDs (like auto-numbering)
    private Long id; // The unique number for each captured Pokémon

    @ManyToOne(fetch = FetchType.LAZY) // Many Pokémon can belong to the same user
    @JoinColumn(name = "user_id") // The column that links to the users table
    private User user; // The trainer who owns this Pokémon

    @Column(name = "pokemon_id", nullable = false) // Cannot be empty
    private Integer pokemonId; // The Pokédex number of this Pokémon's species

    private String nickname; // Optional nickname given by the trainer (like "Sparky" for a Pikachu)

    private Integer level; // The Pokémon's current level (determines strength)

    private Integer experience; // The experience points earned toward the next level

    @Column(name = "last_training_at")
    private LocalDateTime lastTrainingAt; // The last time this Pokémon was trained

    @Column(name = "cooldown_seconds")
    private Integer cooldownSeconds; // The time in seconds before the Pokémon can be trained again

    @Column(name = "current_hp")
    private Integer currentHp; // The Pokémon's current health points

    @Column(name = "custom_stats", columnDefinition = "jsonb")
    private String customStats; // The Pokémon's individual stats stored as JSON

    @Column(columnDefinition = "jsonb")
    private String moveset; // The specific moves this Pokémon knows stored as JSON

    @Column(name = "captured_at")
    private LocalDateTime capturedAt; // When this Pokémon was first caught by the user

    @PrePersist // This method runs automatically before saving a new Pokémon to the database
    protected void onCreate() {
        capturedAt = LocalDateTime.now(); // Set the current time as capture time
        if (level == null)
            level = 5; // If no level was specified, default to level 5
        if (experience == null)
            experience = 0; // If no experience was specified, default to 0
    }
}
