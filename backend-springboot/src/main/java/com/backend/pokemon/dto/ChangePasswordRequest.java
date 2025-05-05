package com.backend.pokemon.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO for change the password once the code is validated.
 * 
 * What is this class? Think of it like a digital login form that users fill out.
 * When someone tries to log in to the app, they need to provide their email
 * and password. This class represents that information.
 * 
 * It's like the paper form you might fill out at a reception desk, but in digital form.
 */
@Data // Automatically creates getters, setters, toString, equals and hashCode methods
public class ChangePasswordRequest {
    @NotBlank(message = "Email is required") // Ensures the field isn't empty
    @Email(message = "Email should be valid") // Checks that the format looks like a real email (contains @ and domain)
    private String email; // The user's email address for account verification and communication
    
    @NotBlank(message = "Password is required") // Ensures the field isn't empty
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters") // Enforces security requirements
    private String password; // The secret password the user will use to access their account
}
