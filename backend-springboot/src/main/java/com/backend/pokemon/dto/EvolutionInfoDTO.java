package com.backend.pokemon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvolutionInfoDTO {
    private Integer pokemonId;
    private String pokemonName;
    private Integer currentLevel;
    private Integer requiredLevel;
    private String evolvesToName;
    private Integer evolvesToId;
    private Boolean requiresItem;
    private String requiredItemName;
    private Long requiredItemId;
    private Boolean userHasItem;
    private Integer userItemQuantity;
    private Boolean canEvolve;
    private String reason;
}