package com.backend.pokemon.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for user registration requests.
 * 
 * What is this class? Think of it like a digital signup form that new users fill out.
 * When someone wants to create a new account in the app, they need to provide
 * their desired username, email address, and password. This class represents that information.
 * 
 * It's similar to a new membership application form, but in digital format.
 */
@Data // Automatically creates getters, setters, toString, equals and hashCode methods
public class SignupRequest {

    @NotBlank(message = "Username is required") // Ensures the field isn't empty - like a "required" field on a paper form
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters") // Enforces length limits
    private String username; // The unique name the user wants to be identified by in the system
    
    @NotBlank(message = "Email is required") // Ensures the field isn't empty
    @Email(message = "Email should be valid") // Checks that the format looks like a real email (contains @ and domain)
    private String email; // The user's email address for account verification and communication
    
    @NotBlank(message = "Password is required") // Ensures the field isn't empty
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters") // Enforces security requirements
    private String password; // The secret password the user will use to access their account
}
