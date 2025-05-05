package com.backend.pokemon.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvolutionRequestDTO {
    @NotNull(message = "El ID del Pokémon es obligatorio")
    private Long userPokemonId;
    
    private Boolean confirmEvolution;
}