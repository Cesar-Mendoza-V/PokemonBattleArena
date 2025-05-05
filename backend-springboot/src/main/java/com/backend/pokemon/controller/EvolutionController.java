package com.backend.pokemon.controller;

import com.backend.pokemon.dto.EvolutionInfoDTO;
import com.backend.pokemon.dto.EvolutionRequestDTO;
import com.backend.pokemon.dto.EvolutionResultDTO;
import com.backend.pokemon.service.EvolutionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pokemon/evolution")
@RequiredArgsConstructor
@Slf4j
public class EvolutionController {
    
    private final EvolutionService evolutionService;
    
    /**
     * Endpoint para verificar si un Pokémon puede evolucionar y los requisitos
     */
    @GetMapping("/check/{userPokemonId}")
    public ResponseEntity<EvolutionInfoDTO> checkEvolutionRequirements(@PathVariable Long userPokemonId) {
        log.info("Verificando requisitos de evolución para el Pokémon ID: {}", userPokemonId);
        EvolutionInfoDTO evolutionInfo = evolutionService.checkEvolutionRequirements(userPokemonId);
        return ResponseEntity.ok(evolutionInfo);
    }
    
    /**
     * Endpoint para evolucionar un Pokémon
     */
    @PostMapping("/evolve")
    public ResponseEntity<EvolutionResultDTO> evolvePokemon(@Valid @RequestBody EvolutionRequestDTO request) {
        log.info("Solicitando evolución para el Pokémon ID: {}", request.getUserPokemonId());
        EvolutionResultDTO result = evolutionService.evolvePokemon(request);
        return ResponseEntity.ok(result);
    }
}