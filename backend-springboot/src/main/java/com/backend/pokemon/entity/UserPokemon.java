package com.backend.pokemon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a Pokemon owned by a user.
 * Maps to the 'user_pokemon' table in the database.
 */
@Entity
@Table(name = "user_pokemon")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPokemon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "pokemon_id", nullable = false)
    private Integer pokemonId;

    private String nickname;

    private Integer level;

    private Integer experience;

    @Column(name = "current_hp")
    private Integer currentHp;

    @Column(name = "custom_stats", columnDefinition = "jsonb")
    private String customStats;  // JSONB data as String

    @Column(columnDefinition = "jsonb")
    private String moveset;  // JSONB data as String

    @Column(name = "captured_at")
    private LocalDateTime capturedAt;

    @PrePersist
    protected void onCreate() {
        capturedAt = LocalDateTime.now();
        if (level == null) level = 5;
        if (experience == null) experience = 0;
    }
}
