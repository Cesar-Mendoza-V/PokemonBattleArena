package com.backend.pokemon.exception;

import com.backend.pokemon.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application.
 * 
 * What is this class? Think of it like a central error management system.
 * 
 * Just as a customer service department handles all complaints in a store,
 * this class catches all errors that happen anywhere in the application and
 * transforms them into user-friendly responses.
 * 
 * Instead of showing users scary error messages, it creates standardized
 * error responses that are easier to understand.
 */
@RestControllerAdvice // Tells Spring this class handles exceptions from all controllers
@Slf4j // Adds automatic logging capabilities to this class
public class GlobalExceptionHandler {

    /**
     * Handle validation errors.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class) // Specifies which exception type this method handles
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        // Create a map to store all validation errors
        Map<String, String> errors = new HashMap<>();
        
        // Extract each validation error and put it in our map
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField(); // Which field had the error (e.g., "email")
            String errorMessage = error.getDefaultMessage(); // What was wrong (e.g., "must be a valid email format")
            errors.put(fieldName, errorMessage);
        });
        
        // Return HTTP 400 (Bad Request) with the validation errors
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Validation failed"));
    }

    /**
     * Handle ResourceAlreadyExistsException.
     */
    @ExceptionHandler(ResourceAlreadyExistsException.class) // Specifies which exception type this method handles
    public ResponseEntity<ApiResponse<Object>> handleResourceAlreadyExists(
            ResourceAlreadyExistsException ex) {
        // Log the error for administrators to see
        log.error("Resource already exists: {}", ex.getMessage());
        
        // Return HTTP 409 (Conflict) with an error message
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Handle ResourceNotFoundException.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(false)
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle EvolutionException.
     */
    @ExceptionHandler(EvolutionException.class)
    public ResponseEntity<ApiResponse<String>> handleEvolutionException(EvolutionException ex) {
        ApiResponse<String> response = ApiResponse.<String>builder()
                .success(false)
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle all other exceptions.
     */
    @ExceptionHandler(Exception.class) // This catches all other types of exceptions
    public ResponseEntity<ApiResponse<Object>> handleAllExceptions(Exception ex) {
        // Log the error with full details for developers to troubleshoot
        log.error("Unhandled exception", ex);
        
        // Return HTTP 500 (Internal Server Error) with a generic error message
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred"));
    }
}
