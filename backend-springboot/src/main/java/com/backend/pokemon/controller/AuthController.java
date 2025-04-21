package com.backend.pokemon.controller;

import com.backend.pokemon.dto.ApiResponse;
import com.backend.pokemon.dto.JwtResponse;
import com.backend.pokemon.dto.LoginRequest;
import com.backend.pokemon.dto.SignupRequest;
import com.backend.pokemon.entity.User;
import com.backend.pokemon.exception.ResourceAlreadyExistsException;
import com.backend.pokemon.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication endpoints.
 * 
 * What's a controller? Think of it like a receptionist at a hotel who handles
 * specific kinds of requests from users (like checking in or out).
 * 
 * This controller specifically handles user login and registration requests.
 * It receives data from the frontend app and sends appropriate responses back.
 */
@RestController // Tells Spring this class will handle web requests and return data (not web pages)
@RequestMapping("/auth") // All URLs handled by this controller will start with "/api/auth"
@RequiredArgsConstructor // Automatically creates a constructor for required final fields (authService)
public class AuthController {

    private final AuthService authService; // The service that will do the actual authentication work

    /**
     * Register a new user.
     * 
     * This is like filling out a membership form at a gym - you provide your details,
     * and if everything looks good, you get signed up as a new member.
     * 
     * @param signUpRequest Contains user registration details (username, email, password)
     * @return A message telling you if registration worked or why it failed
     */
    @PostMapping("/signup") // This method handles POST requests to "/api/auth/signup"
    public ResponseEntity<ApiResponse<String>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            // Ask the auth service to create a new user with the provided details
            User user = authService.registerUser(signUpRequest);
            
            // If successful, return HTTP 200 (OK) with a success message
            return ResponseEntity.ok(ApiResponse.success(
                    "User registered successfully!", user.getUsername()));
        } catch (ResourceAlreadyExistsException e) {
            // If username/email already exists, return HTTP 409 (Conflict) with error message
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            // For any other errors, return HTTP 500 (Server Error)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred during registration"));
        }
    }

    /**
     * Authenticate a user (log them in).
     * 
     * This is like checking in at a hotel - you provide your ID and booking details,
     * and if they match what's in the system, you get a room key (JWT token).
     * 
     * @param loginRequest Contains login credentials (email and password)
     * @return If successful, returns a JWT token (like a digital ID card) that the user can use for future requests
     */
    @PostMapping("/login") // This method handles POST requests to "/api/auth/login"
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Try to authenticate the user with provided credentials
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            
            // If successful, return HTTP 200 (OK) with the JWT token and user details
            return ResponseEntity.ok(ApiResponse.success(
                    "Login successful", jwtResponse));
        } catch (Exception e) {
            // If authentication fails, return HTTP 401 (Unauthorized)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid username or password"));
        }
    }
}
