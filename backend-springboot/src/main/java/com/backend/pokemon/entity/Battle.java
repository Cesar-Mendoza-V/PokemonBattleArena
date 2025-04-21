package com.backend.pokemon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a battle between two users.
 * 
 * What is this class? Think of it like a digital record of a Pokémon battle.
 * Just as a sports match has two teams, a referee, a score, and a timestamp,
 * our Battle keeps track of who battled whom, what happened during the fight,
 * and the final outcome.
 * 
 * This information is stored in the 'battles' table in the database.
 */
@Entity // Tells Spring this class represents a table in the database
@Table(name = "battles") // Specifies the name of the database table
@Data // Automatically creates getters, setters, equals, hashCode methods
@Builder // Makes it easy to create Battle objects step by step
@NoArgsConstructor // Creates an empty constructor (required for JPA)
@AllArgsConstructor // Creates a constructor with all fields
public class Battle {

    @Id // Marks this as the primary key (unique identifier)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates unique IDs (like auto-numbering)
    private Long id; // The unique number for each battle

    @ManyToOne(fetch = FetchType.LAZY) // Many battles can involve the same user (player1)
    @JoinColumn(name = "player1_id") // The column that links to the users table
    private User player1; // The first trainer in the battle

    @ManyToOne(fetch = FetchType.LAZY) // Many battles can involve the same user (player2)
    @JoinColumn(name = "player2_id") // The column that links to the users table
    private User player2; // The second trainer in the battle

    @Column // This field maps to a column in the database table
    private String status; // Current state of the battle (PENDING, IN_PROGRESS, COMPLETED, etc.)

    @Column
    private String result; // Outcome of the battle (PLAYER1_WIN, PLAYER2_WIN, DRAW, etc.)

    @Column(name = "battle_data", columnDefinition = "jsonb") // Stores complex JSON data about the battle
    private String battleData; // Details of what happened during the battle (moves used, damage dealt, etc.)

    @Column(name = "started_at")
    private LocalDateTime startedAt; // When the battle began (date and time)

    @Column(name = "ended_at")
    private LocalDateTime endedAt; // When the battle finished (date and time)

    @PrePersist // This method runs automatically before saving a new battle to the database
    protected void onCreate() {
        startedAt = LocalDateTime.now(); // Set the current time as the battle start time
        if (status == null) status = "PENDING"; // If no status was set, default to "PENDING"
    }
}
