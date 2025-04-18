package com.backend.pokemon.repository;

import com.backend.pokemon.entity.Battle;
import com.backend.pokemon.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Battle entity operations.
 */
@Repository
public interface BattleRepository extends JpaRepository<Battle, Long> {
    
    List<Battle> findByPlayer1OrPlayer2(User player1, User player2);
    
    List<Battle> findByStatusOrderByStartedAtDesc(String status);
}
