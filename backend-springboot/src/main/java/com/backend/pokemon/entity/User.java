package com.backend.pokemon.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a user in the system.
 * 
 * What is this class? Think of it like a digital player card for each person who uses the app.
 * Just as a gym membership card holds your personal information (name, membership ID, etc.),
 * this class stores essential data about each user in our database.
 * 
 * This information is stored in the 'users' table in the database.
 */
@Entity // Tells Spring this class represents a table in the database
@Table(name = "users") // Specifies the name of the database table
@Data // Automatically creates getters, setters, equals, hashCode methods
@Builder // Makes it easy to create User objects step by step
@NoArgsConstructor // Creates an empty constructor (required for JPA)
@AllArgsConstructor // Creates a constructor with all fields
public class User {

    @Id // Marks this as the primary key (unique identifier)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generates unique IDs (like auto-numbering)
    private Long id; // The unique number for each user in our system

    @Column(unique = true, nullable = false) // Must be unique and cannot be empty
    private String username; // The name the user chooses to be identified by in the app

    @Column(unique = true, nullable = false) // Must be unique and cannot be empty
    private String email; // The user's email address for login and communication

    @Column(nullable = false) // Cannot be empty
    private String password; // The encrypted version of the user's password (never stored as plain text)

    @Column(nullable = false) // Cannot be empty
    private String role; // The user's role in the system (e.g., "USER", "ADMIN") - determines what they can do

    @Column(nullable = false) // Cannot be empty
    private LocalDateTime createdAt; // When this user account was created (date and time)
}
