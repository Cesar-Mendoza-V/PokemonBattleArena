package com.backend.pokemon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Generic API response DTO for consistent response format.
 * 
 * What is this class? Think of it like a standard envelope for all messages sent from
 * the server to the app. No matter what information we're sending, it will always be
 * packaged in the same format with these details:
 * - Was the request successful?
 * - What message do we want to tell the user?
 * - What data are we returning (if any)?
 * - When was this response created?
 */
@Data // Automatically creates getters, setters, toString, equals and hashCode methods
@Builder // Allows creating objects in a step-by-step way (like building with Legos)
@NoArgsConstructor // Creates an empty constructor with no parameters
@AllArgsConstructor // Creates a constructor that accepts all properties as parameters
public class ApiResponse<T> {
    
    private boolean success; // Was the operation successful? (true/false)
    private String message; // A human-readable message explaining what happened
    private T data; // The actual data being returned (could be any type - that's what T means)
    private LocalDateTime timestamp; // When this response was created (date and time)
    
    /**
     * Create a successful response with data.
     * 
     * This is like sending a package with a "SUCCESS" sticker, a note explaining
     * what's inside, and the actual item the person requested.
     * 
     * @param message A success message to display to the user
     * @param data The data requested by the user
     * @return A complete ApiResponse object marked as successful
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true) // Mark as successful
                .message(message) // Attach the success message
                .data(data) // Include the requested data
                .timestamp(LocalDateTime.now()) // Add the current time
                .build();
    }
    
    /**
     * Create an error response without data.
     * 
     * This is like sending back an envelope with a "FAILED" sticker and a note
     * explaining what went wrong, but no actual item inside.
     * 
     * @param message An error message explaining what went wrong
     * @return A complete ApiResponse object marked as unsuccessful
     */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false) // Mark as unsuccessful
                .message(message) // Attach the error message
                .timestamp(LocalDateTime.now()) // Add the current time
                .build(); // Note: no data is included since the operation failed
    }
}
