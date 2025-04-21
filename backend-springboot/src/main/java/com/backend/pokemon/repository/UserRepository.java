package com.backend.pokemon.repository;

import com.backend.pokemon.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity operations.
 * 
 * What is this interface? Think of it like a digital user directory or address book.
 * 
 * Just as an address book lets you look up people by name or address,
 * this repository helps the application find, add, update, and remove users
 * in the database using different search criteria like username or email.
 */
@Repository // Marks this as a repository that Spring should manage
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find a user by username.
     * 
     * Like looking up someone in a directory by their nickname.
     * 
     * @param username the username to search for
     * @return an Optional containing the user if found
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Find a user by email.
     * 
     * Like looking up someone in a directory by their email address.
     * 
     * @param email the email to search for
     * @return an Optional containing the user if found
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if a username already exists.
     * 
     * Like asking "Is the nickname 'AshKetchum' already taken?"
     * Used during registration to prevent duplicate usernames.
     * 
     * @param username the username to check
     * @return true if the username exists, false otherwise
     */
    boolean existsByUsername(String username);
    
    /**
     * Check if an email already exists.
     * 
     * Like asking "Is someone already registered with ash@pokemon.com?"
     * Used during registration to prevent duplicate accounts.
     * 
     * @param email the email to check
     * @return true if the email exists, false otherwise
     */
    boolean existsByEmail(String email);
}
