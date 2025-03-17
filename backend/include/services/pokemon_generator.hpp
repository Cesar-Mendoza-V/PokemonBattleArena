// Copyright 2024 Pokemon Battle Arena Project
// Service to generate random Pokemon based on zone restrictions

#pragma once

#include <string>
#include <vector>
#include <map>
#include <random>
#include <crow.h>
#include <curl/curl.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

/**
 * [POKEMON_GENERATOR] - Service class for generating random Pokemon encounters
 * based on zone-specific restrictions such as Pokemon types.
 */
class PokemonGenerator {
public:
    /**
     * Constructor initializes the generator with predefined zone configurations
     */
    PokemonGenerator();

    /**
     * Destructor ensures proper cleanup of any resources
     */
    ~PokemonGenerator();

    /**
     * Generates a random Pokemon based on the specified zone
     * 
     * @param zone The zone identifier where the player is located
     * @return JSON object containing the generated Pokemon data
     */
    json generateRandomPokemon(const std::string& zone);

private:
    // Callback function for CURL to write response data
    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* s);
    
    // Fetches Pokemon data from PokeAPI
    json fetchFromPokeAPI(const std::string& endpoint);
    
    // Gets a list of Pokemon of specific types
    std::vector<int> getPokemonByTypes(const std::vector<std::string>& types);
    
    // Gets detailed information about a specific Pokemon
    json getPokemonDetails(int pokemonId);
    
    // Map of zones and their type restrictions
    std::map<std::string, std::vector<std::string>> zoneTypes;
    
    // Random number generator
    std::mt19937 rng;
    
    // Cache for Pokemon by type to avoid repeated API calls
    std::map<std::string, std::vector<int>> typeCache;
};