package com.backend.pokemon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * DTO for JWT authentication response.
 * 
 * What is this class? Think of it like the digital version of what you get after successfully
 * checking in at a hotel: your room key (the access token) and your guest information.
 * 
 * When a user logs in successfully, we send back this object containing:
 * - The access token (like a digital key card for accessing secure areas)
 * - Information about the logged-in user (their ID, name, email, etc.)
 * - Details about what type of token we've provided
 */
@Data // Automatically creates getters, setters, toString, equals and hashCode methods
@Builder // Makes it easy to build this object step by step in a clean way
@AllArgsConstructor // Creates a constructor that takes all these fields as parameters
public class JwtResponse {
    
    private String accessToken; // The JWT token itself - like a digital key card that proves who you are
    private String tokenType;   // Usually set to "Bearer" - indicates how the token should be used
    private Long userId;        // The user's unique ID number in our database
    private String username;    // The user's chosen username
    private String email;       // The user's email address
    private String role;        // The user's role in the system (e.g., "USER", "ADMIN") - determines what they can do
}
