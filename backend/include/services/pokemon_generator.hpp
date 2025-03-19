// Copyright 2024 Pokemon Battle Arena Project
// Service to generate random Pokemon based on zone restrictions

/**
 * INDEX - SEARCH KEYWORDS
 * ======================
 * [CLASS_DEFINITION] - Main class definition for the Pokemon generator
 * [CONSTRUCTOR] - Initialization of the Pokemon generator
 * [DESTRUCTOR] - Cleanup and resource management
 * [PUBLIC_API] - Public methods for generating Pokemon
 * [API_HELPERS] - Helper methods for API interactions
 * [POKEMON_FILTER] - Methods for filtering Pokemon by type
 * [POKEMON_DETAILS] - Methods for getting detailed Pokemon information
 * [DATA_STRUCTURES] - Internal data structures and organization
 * [CACHING] - Mechanisms to improve performance through caching
 * [RANDOMIZATION] - Random number generation for Pokemon selection
 * [COOLDOWN] - Cooldown mechanism to prevent endpoint spamming
 */

#pragma once

#include <string>
#include <vector>
#include <map>
#include <random>
#include <chrono>
#include <crow.h>
#include <curl/curl.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

/**
 * [CLASS_DEFINITION] - Service class for generating random Pokemon encounters
 * based on zone-specific restrictions such as Pokemon types.
 */
class PokemonGenerator
{
public:
    /**
     * [CONSTRUCTOR] - Initializes the generator with predefined zone configurations
     * Sets up zone type restrictions, level ranges, and initializes the RNG
     */
    PokemonGenerator();

    /**
     * [DESTRUCTOR] - Ensures proper cleanup of any resources
     * Particularly important for freeing CURL resources
     */
    ~PokemonGenerator();

    /**
     * [PUBLIC_API] - Generates a single random Pokemon based on the specified zone
     *
     * @param zone The zone identifier where the player is located
     * @return JSON object containing the generated Pokemon data
     */
    json generateRandomPokemon(const std::string &zone);

    /**
     * [PUBLIC_API] - Generates multiple random Pokemon based on the specified zone
     * The IdUser parameter ensures each user gets their own set of Pokemon
     * 
     * @param zone The zone identifier where the player is located
     * @param IdUser ID of the user requesting Pokemon (default: 0)
     * @param maxCount Maximum number of Pokemon that can be generated (default: 4)
     * @return JSON object containing an array of generated Pokemon data
     */
    json generateMultiplePokemon(const std::string& zone, int IdUser = 0, int maxCount = 4);

private:
    // [API_HELPERS] - Callback function for CURL to write response data
    static size_t WriteCallback(void *contents, size_t size, size_t nmemb, std::string *s);

    // [API_HELPERS] - Fetches Pokemon data from PokeAPI
    json fetchFromPokeAPI(const std::string &endpoint);

    // [POKEMON_FILTER] - Gets a list of Pokemon of specific types
    std::vector<int> getPokemonByTypes(const std::vector<std::string> &types);

    // [POKEMON_DETAILS] - Gets detailed information about a specific Pokemon
    json getPokemonDetails(int pokemonId);

    // [DATA_STRUCTURES] - Map of zones and their type restrictions
    std::map<std::string, std::vector<std::string>> zoneTypes;

    // [RANDOMIZATION] - Random number generator
    std::mt19937 rng;

    // [CACHING] - Cache for Pokemon by type to avoid repeated API calls
    std::map<std::string, std::vector<int>> typeCache;

    // [DATA_STRUCTURES] - Structure to hold level ranges for each zone
    struct LevelRange
    {
        int min;
        int max;
    };

    // [DATA_STRUCTURES] - Map of zones and their level ranges
    std::map<std::string, LevelRange> zoneLevels;
    
    // [COOLDOWN] - Structure to store encounter data and last encounter time
    struct EncounterData {
        json pokemon_data;                           // Cached encounter result
        std::chrono::system_clock::time_point last_encounter;  // When the encounter happened
    };

    // [COOLDOWN] - Map to track cooldowns by zone
    std::map<std::string, EncounterData> encounter_cache;

    // [COOLDOWN] - Cooldown time in seconds (5 minutes)
    const int ENCOUNTER_COOLDOWN_SECONDS = 300;
};