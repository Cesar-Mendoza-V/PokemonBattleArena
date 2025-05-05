package com.backend.pokemon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvolutionResultDTO {
    private Boolean success;
    private String message;
    private Integer originalPokemonId;
    private String originalPokemonName;
    private Integer evolvedPokemonId;
    private String evolvedPokemonName;
    private String itemUsed;
}