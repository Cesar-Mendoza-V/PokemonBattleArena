package com.backend.pokemon.service;

import com.backend.pokemon.dto.JwtResponse;
import com.backend.pokemon.dto.LoginRequest;
import com.backend.pokemon.dto.SignupRequest;
import com.backend.pokemon.entity.User;
import com.backend.pokemon.exception.ResourceAlreadyExistsException;
import com.backend.pokemon.repository.UserRepository;
import com.backend.pokemon.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Collection;

/**
 * Service for authentication operations.
 * 
 * What is this class? Think of it like the customer service desk at a
 * membership club.
 * 
 * This service handles two main tasks:
 * 1. Registering new users (like signing up new members)
 * 2. Authenticating existing users (like checking in existing members)
 * 
 * It works with the database to store new users and verify credentials,
 * and creates secure tokens for users who log in successfully.
 */
@Service // Marks this as a service that Spring should manage
@RequiredArgsConstructor // Automatically creates a constructor for required final fields
@Slf4j // Adds automatic logging capabilities to this class
public class AuthService {

    private final UserRepository userRepository; // For finding and saving users in the database
    private final PasswordEncoder passwordEncoder; // For securely encrypting passwords
    private final AuthenticationManager authenticationManager; // For verifying login credentials
    private final JwtTokenProvider tokenProvider; // For creating JWT tokens after successful login
    private final EmailService emailService;

    /**
     * Register a new user in the system.
     * 
     * This is like signing up a new member at a club:
     * 1. Check if the username or email is already taken
     * 2. If not, create a new user account with the encrypted password
     * 3. Save the new user to the database
     * 
     * @param signUpRequest Contains the user's registration details
     * @return The newly created user
     * @throws ResourceAlreadyExistsException if username or email is already in use
     */
    @Transactional // Ensures this operation is atomic (all succeeds or all fails)
    public User registerUser(SignupRequest signUpRequest) {
        log.info("Attempting to register user: {}", signUpRequest.getUsername());

        // Check if username is already taken
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            log.warn("Username is already taken: {}", signUpRequest.getUsername());
            throw new ResourceAlreadyExistsException("Username is already taken!");
        }

        // Check if email is already in use
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            log.warn("Email is already in use: {}", signUpRequest.getEmail());
            throw new ResourceAlreadyExistsException("Email is already in use!");
        }

        // Create the new user with encrypted password
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword())) // Encrypt password for security
                .role("USER") // Default role for new users
                .createdAt(LocalDateTime.now())
                .build();

        // Save the user to the database
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getUsername());

        // Sending email to new user
        emailService.singUpEmail(signUpRequest.getEmail());
        log.info("'Welcome' email sent succesfully to: {}", savedUser.getEmail());
        return savedUser;
    }

    /**
     * Authenticate a user and generate JWT token.
     * 
     * This is like checking in a member at a club:
     * 1. Look up the user by email
     * 2. Verify their password
     * 3. If valid, create a digital ID card (JWT token) they can use for future
     * requests
     * 
     * @param loginRequest Contains the user's login credentials
     * @return A JWT response containing the token and user details
     * @throws Exception if authentication fails
     */
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        log.info("Attempting to authenticate user with email: {}", loginRequest.getEmail());

        try {
            // Find the user by email
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException(
                            "User not found with email: " + loginRequest.getEmail()));

            // Attempt to authenticate with the provided credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            loginRequest.getPassword()));

            // Store the authentication in the security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get the authenticated user details
            org.springframework.security.core.userdetails.User userDetails = (org.springframework.security.core.userdetails.User) authentication
                    .getPrincipal();

            // Get the user's permissions
            Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

            // Generate a JWT token
            String jwt = tokenProvider.generateToken(userDetails.getUsername(), authorities);

            // Build and return the response with token and user details
            return JwtResponse.builder()
                    .accessToken(jwt)
                    .tokenType("Bearer")
                    .userId(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();
        } catch (Exception e) {
            log.error("Authentication failed for email: {}", loginRequest.getEmail());
            throw e; // Re-throw the exception to be handled by the controller
        }
    }
}
