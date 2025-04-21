package com.backend.pokemon.security;

import com.backend.pokemon.entity.User;
import com.backend.pokemon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

/**
 * Custom implementation of Spring Security's UserDetailsService.
 * 
 * What is this class? Think of it like a security guard at the entrance of a building.
 * 
 * When someone tries to log in, this service looks up their information in the user
 * database and prepares it in a format that Spring Security can use to verify
 * their identity and determine what they're allowed to do in the application.
 */
@Service // Marks this as a service that Spring should manage
@RequiredArgsConstructor // Automatically creates a constructor for required final fields
@Slf4j // Adds automatic logging capabilities to this class
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository; // Used to find users in the database

    /**
     * Load user details by username for authentication.
     * 
     * When someone tries to log in with a username, this method:
     * 1. Searches the database for a user with that username
     * 2. If found, converts our User object to Spring Security's UserDetails format
     * 3. Adds the user's role as an "authority" (permission)
     * 
     * It's like translating our user's ID card into a format the security system can understand.
     */
    @Override
    @Transactional(readOnly = true) // Makes database operations more efficient for read-only operations
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Look up the user in our database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        // Create a permission based on the user's role (e.g., "ROLE_USER" or "ROLE_ADMIN")
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole());

        // Return a Spring Security user object that contains:
        // - The username for identification
        // - The password for verification 
        // - The permissions this user has
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singleton(authority)
        );
    }
}
