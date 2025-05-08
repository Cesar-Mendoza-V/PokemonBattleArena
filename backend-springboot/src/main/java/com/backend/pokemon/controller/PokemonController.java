package com.backend.pokemon.controller;

import com.backend.pokemon.dto.ApiResponse;
import com.backend.pokemon.dto.TrainRequest;
import com.backend.pokemon.service.PokemonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pokemon") // Establece la ruta base para las solicitudes relacionadas con Pokémon
public class PokemonController {

    private final PokemonService pokemonService;

    // Constructor que inyecta el servicio PokemonService
    public PokemonController(PokemonService pokemonService) {
        this.pokemonService = pokemonService;
    }

    // Método para entrenar a un Pokémon
    @PostMapping("/train")
    public ResponseEntity<ApiResponse<String>> trainPokemon(@RequestBody TrainRequest trainRequest) {
        // Llamamos al servicio para entrenar al Pokémon
        return pokemonService.trainPokemon(trainRequest);
    }
}
