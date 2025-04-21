package com.backend.pokemon.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;

import com.backend.pokemon.config.JwtConfig;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

/**
 * Provider class for JWT token generation and validation.
 * 
 * What is this class? Think of it like the ID card printing and verification office.
 * 
 * This class has two main jobs:
 * 1. Creating secure digital ID cards (JWT tokens) when users log in successfully
 * 2. Verifying these ID cards when users try to access protected resources
 * 
 * It handles the cryptographic signing of tokens (like applying an official seal)
 * and extracting user information from tokens (like reading an ID card).
 */
@Component // Marks this as a component that Spring should manage
@Slf4j // Adds automatic logging capabilities to this class
@RequiredArgsConstructor // Automatically creates a constructor for required final fields
public class JwtTokenProvider {

    private final JwtConfig jwtConfig; // Contains settings like secret key and token expiration
    
    private Key key; // The cryptographic key used to sign and verify tokens
    
    @PostConstruct // This method runs once after the object is created
    public void init() {
        // Check if the configured secret is secure enough (at least 64 characters)
        if (jwtConfig.getSecret().length() < 64) {
            log.warn("JWT secret too short, generating secure key");
            this.key = Keys.secretKeyFor(SignatureAlgorithm.HS512); // Generate a secure key
        } else {
            this.key = Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes()); // Use the configured secret
        }
    }

    /**
     * Generate a JWT token for a user.
     * 
     * This is like printing a new ID card when someone logs in successfully.
     * The ID card contains the user's name and what they're allowed to do.
     * 
     * @param username the username
     * @param roles the user's roles
     * @return the JWT token
     */
    public String generateToken(String username, Collection<? extends GrantedAuthority> roles) {
        Claims claims = Jwts.claims().setSubject(username); // Set the main subject (who this token belongs to)
        claims.put("roles", roles.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","))); // Add what roles/permissions they have

        Date now = new Date(); // Current time
        Date expiryDate = new Date(now.getTime() + jwtConfig.getExpiration()); // When token expires

        return Jwts.builder()
                .setClaims(claims) // Add the user info and permissions
                .setIssuedAt(now) // When this token was created
                .setExpiration(expiryDate) // When this token expires
                .signWith(key, SignatureAlgorithm.HS512) // Sign it with our secret key
                .compact(); // Package it all up into a token string
    }

    /**
     * Get username from JWT token.
     * 
     * This is like reading someone's name from their ID card.
     * 
     * @param token the JWT token
     * @return the username
     */
    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key) // Use our secret key to verify the signature
                .build()
                .parseClaimsJws(token) // Parse and verify the token
                .getBody(); // Get the contents

        return claims.getSubject(); // Return the username
    }

    /**
     * Validate a JWT token.
     * 
     * This checks if an ID card is legitimate and not expired or tampered with.
     * 
     * @param authToken the JWT token
     * @return true if valid, false otherwise
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true; // Token is valid
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return false; // Token is invalid
        }
    }
    
    /**
     * Get authentication from JWT token.
     * 
     * This converts a validated ID card into a temporary security badge
     * that Spring Security can understand and use.
     * 
     * @param token the JWT token
     * @return the Authentication object
     */
    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        
        // Extract the roles/permissions from the token
        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get("roles").toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
        
        // Create a user object (not our database User, but Spring's security User)
        User principal = new User(claims.getSubject(), "", authorities);
        
        // Create and return the authentication token Spring Security understands
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }
}
