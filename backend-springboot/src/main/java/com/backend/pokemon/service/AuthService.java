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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;

/**
 * Service for authentication operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    /**
     * Register a new user in the system.
     */
    @Transactional
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

        // Create new user
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .role("USER")  // Default role
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getUsername());
        return savedUser;
    }

    /**
     * Authenticate a user and generate JWT token.
     */
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        log.info("Attempting to authenticate user: {}", loginRequest.getUsername());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            org.springframework.security.core.userdetails.User userDetails = 
                    (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
            
            Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
            
            String jwt = tokenProvider.generateToken(userDetails.getUsername(), authorities);
            
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return JwtResponse.builder()
                    .accessToken(jwt)
                    .tokenType("Bearer")
                    .userId(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole())
                    .build();
        } catch (Exception e) {
            log.error("Authentication failed for user: {}", loginRequest.getUsername());
            throw e;
        }
    }
}
