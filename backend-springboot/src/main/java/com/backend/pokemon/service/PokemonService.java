package com.backend.pokemon.service;

import org.springframework.stereotype.Service;

import com.backend.pokemon.dto.ApiResponse;
import com.backend.pokemon.dto.TrainRequest;
import com.backend.pokemon.entity.UserPokemon;
import com.backend.pokemon.repository.UserPokemonRepository;

import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PokemonService {

    public enum Difficulty {
        EASY, MEDIUM, HARD;
    }

    private final UserPokemonRepository userPokemonRepository;

    public PokemonService(UserPokemonRepository userPokemonRepository) {
        this.userPokemonRepository = userPokemonRepository;
    }

    public ResponseEntity<ApiResponse<String>> trainPokemon(TrainRequest request) {
        // Variables de incremento y cooldown basados en la dificultad
        int increment = 0;
        int cooldown = 0;

        /*
         * Difficulty difficulty;
         * try {
         * difficulty = Difficulty.valueOf(request.getDifficulty().toUpperCase());
         * } catch (IllegalArgumentException e) {
         * return
         * ResponseEntity.badRequest().body(ApiResponse.error("Invalid difficulty"));
         * }
         * 
         * switch (difficulty) {
         * case EASY:
         * increment = 1;
         * cooldown = 3600;
         * break;
         * case MEDIUM:
         * increment = 2;
         * cooldown = 10800;
         * break;
         * case HARD:
         * increment = 3;
         * cooldown = 21600;
         * break;
         * }
         */

        if (request.getDifficulty() == "hard") {
            increment = 3;
            cooldown = 21600;
        }

        // Buscar el Pokémon del usuario
        List<UserPokemon> upOpt = userPokemonRepository.findByUserIdAndPokemonId(
                request.getUserId(), request.getPokemonId());

        if (upOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Pokemon not found for user"));
        }

        UserPokemon up = upOpt.get(0);

        // Verificar cooldown
        LocalDateTime now = LocalDateTime.now();
        if (up.getLastTrainingAt() != null) {
            LocalDateTime nextTrainingTime = up.getLastTrainingAt().plusSeconds(up.getCooldownSeconds());
            if (now.isBefore(nextTrainingTime)) {
                Duration remaining = Duration.between(now, nextTrainingTime);
                return ResponseEntity.badRequest().body(ApiResponse.error("You must wait " +
                        remaining.toMinutes() + " minutes before training again."));
            }
        }

        // Actualizar los valores del Pokémon (nivel, experiencia y tiempos)
        up.setLevel(up.getLevel() + increment);
        up.setExperience(up.getExperience() + increment * 10); // Ejemplo de cálculo de experiencia
        up.setLastTrainingAt(now); // Registrar la hora del último entrenamiento
        up.setCooldownSeconds(cooldown); // Establecer cooldown

        // Guardar los cambios
        userPokemonRepository.save(up);

        // Retornar respuesta exitosa con el nuevo nivel
        return ResponseEntity
                .ok(ApiResponse.success("Trained successfully. New level: " + up.getLevel(), up.getId().toString()));
    }
}
