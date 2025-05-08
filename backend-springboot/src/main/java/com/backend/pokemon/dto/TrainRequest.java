package com.backend.pokemon.dto;

import lombok.Data;

@Data
// Automatically creates getters, setters, toString, equals and hashCode methods
/**
 * DTO for training a Pokémon.
 * 
 * What is this class? Think of it like a digital form that users fill out when
 * they want to train their Pokémon in the app. When someone wants to train a
 * Pokémon, they need to provide their user ID, the Pokémon's ID, and the
 * difficulty level of the training. This class represents that information.
 * 
 * It's similar to a training request form, but in digital format.
 */
public class TrainRequest {
    private Long userId;
    private Long pokemonId;
    private String difficulty;
}
