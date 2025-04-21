package com.backend.pokemon.repository;

import com.backend.pokemon.entity.Battle;
import com.backend.pokemon.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Battle entity operations.
 * 
 * What is this interface? Think of it like a specialized librarian for battle records.
 * 
 * Just as a librarian helps you find books in a library, this repository
 * helps the application find, save, update, and delete battle information
 * in the database without having to write complex database queries.
 * 
 * It automatically provides methods to handle basic operations like findById,
 * save, delete, etc., plus the custom search methods defined below.
 */
@Repository // Marks this as a repository that Spring should manage
public interface BattleRepository extends JpaRepository<Battle, Long> {
    
    /**
     * Find all battles involving a specific user (either as player1 or player2).
     * 
     * Like asking "Show me all chess matches where Alice or Bob participated".
     */
    List<Battle> findByPlayer1OrPlayer2(User player1, User player2);
    
    /**
     * Find all battles with a specific status, ordered by start time (newest first).
     * 
     * Like asking "Show me all ongoing matches, starting with the most recent ones".
     */
    List<Battle> findByStatusOrderByStartedAtDesc(String status);
}
