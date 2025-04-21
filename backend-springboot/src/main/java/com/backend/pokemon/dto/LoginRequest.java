package com.backend.pokemon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for user login requests.
 * 
 * What is this class? Think of it like a digital login form that users fill out.
 * When someone tries to log in to the app, they need to provide their email
 * and password. This class represents that information.
 * 
 * It's like the paper form you might fill out at a reception desk, but in digital form.
 */
@Data // Automatically creates getters, setters, toString, equals and hashCode methods
public class LoginRequest {
    
    @NotBlank // This ensures the email can't be empty or just whitespace
    private String email;    // The user's email address they registered with
    
    @NotBlank // This ensures the password can't be empty or just whitespace
    private String password; // The user's secret password for verification
}
