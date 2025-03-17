// Copyright 2024 Pokemon Battle Arena Project
// Implementation of the Pokemon generator service

#include "services/pokemon_generator.hpp"
#include <iostream>
#include <algorithm>
#include <ctime>

PokemonGenerator::PokemonGenerator() {
    // Initialize random number generator
    std::random_device rd;
    rng = std::mt19937(rd());
    
    // Initialize zone type restrictions
    zoneTypes["forest"] = {"grass", "bug", "poison"};
    zoneTypes["mountain"] = {"rock", "ground", "fighting"};
    zoneTypes["cave"] = {"rock", "ground", "dark"};
    zoneTypes["ocean"] = {"water"};
    zoneTypes["beach"] = {"water", "ground"};
    zoneTypes["volcano"] = {"fire", "rock"};
    zoneTypes["meadow"] = {"grass", "fairy", "normal"};
    zoneTypes["city"] = {"normal", "electric", "poison"};
    zoneTypes["ruins"] = {"ghost", "psychic", "rock"};
    zoneTypes["jungle"] = {"grass", "bug", "poison", "flying"};
    
    // Default zone for invalid requests
    zoneTypes["default"] = {"normal"};
    
    // Initialize CURL globally
    curl_global_init(CURL_GLOBAL_DEFAULT);
}

PokemonGenerator::~PokemonGenerator() {
    // Clean up CURL
    curl_global_cleanup();
}

size_t PokemonGenerator::WriteCallback(void* contents, size_t size, size_t nmemb, std::string* s) {
    size_t newLength = size * nmemb;
    try {
        s->append((char*)contents, newLength);
        return newLength;
    } catch(std::bad_alloc& e) {
        // Handle memory problem
        return 0;
    }
}

json PokemonGenerator::fetchFromPokeAPI(const std::string& endpoint) {
    CURL* curl;
    CURLcode res;
    std::string readBuffer;
    
    curl = curl_easy_init();
    if(curl) {
        std::string url = "https://pokeapi.co/api/v2/" + endpoint;
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        curl_easy_setopt(curl, CURLOPT_USERAGENT, "PokemonBattleArena/1.0");
        curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);
        
        res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
        
        if(res != CURLE_OK) {
            std::cerr << "CURL error: " << curl_easy_strerror(res) << std::endl;
            return json::object();
        }
    }
    
    try {
        return json::parse(readBuffer);
    } catch (json::parse_error& e) {
        std::cerr << "JSON parse error: " << e.what() << std::endl;
        return json::object();
    }
}

std::vector<int> PokemonGenerator::getPokemonByTypes(const std::vector<std::string>& types) {
    std::vector<int> result;
    
    // Check if we already have this type in cache
    if (types.size() == 1 && typeCache.find(types[0]) != typeCache.end()) {
        return typeCache[types[0]];
    }
    
    // For simplicity, we'll just use the first type to filter
    if (!types.empty()) {
        std::string primaryType = types[0];
        
        // Check cache first
        if (typeCache.find(primaryType) == typeCache.end()) {
            // Fetch Pokemon of this type from PokeAPI
            json typeData = fetchFromPokeAPI("type/" + primaryType);
            
            if (!typeData.empty() && typeData.contains("pokemon")) {
                std::vector<int> typePokemon;
                for (const auto& entry : typeData["pokemon"]) {
                    std::string url = entry["pokemon"]["url"];
                    
                    // Extract Pokemon ID from URL
                    size_t lastSlash = url.find_last_of("/", url.length() - 2);
                    size_t secondLastSlash = url.find_last_of("/", lastSlash - 1);
                    std::string idStr = url.substr(secondLastSlash + 1, lastSlash - secondLastSlash - 1);
                    
                    try {
                        int id = std::stoi(idStr);
                        // Limit to original 151 Pokemon for simplicity
                        if (id <= 151) {
                            typePokemon.push_back(id);
                        }
                    } catch (...) {
                        // Skip if ID parsing fails
                    }
                }
                typeCache[primaryType] = typePokemon;
            }
        }
        
        result = typeCache[primaryType];
    }
    
    // If no Pokemon found, return a default list (first 151 Pokemon)
    if (result.empty()) {
        for (int i = 1; i <= 151; i++) {
            result.push_back(i);
        }
    }
    
    return result;
}

json PokemonGenerator::getPokemonDetails(int pokemonId) {
    return fetchFromPokeAPI("pokemon/" + std::to_string(pokemonId));
}

json PokemonGenerator::generateRandomPokemon(const std::string& zone) {
    // Find zone type restrictions
    auto it = zoneTypes.find(zone);
    std::vector<std::string> types;
    
    if (it != zoneTypes.end()) {
        types = it->second;
    } else {
        types = zoneTypes["default"];
    }
    
    // Get Pokemon of these types
    std::vector<int> possiblePokemon = getPokemonByTypes(types);
    
    if (possiblePokemon.empty()) {
        // Fallback to first 151 if no Pokemon found
        for (int i = 1; i <= 151; i++) {
            possiblePokemon.push_back(i);
        }
    }
    
    // Select a random Pokemon from the list
    std::uniform_int_distribution<> dist(0, possiblePokemon.size() - 1);
    int selectedIndex = dist(rng);
    int selectedPokemonId = possiblePokemon[selectedIndex];
    
    // Determine if Pokemon is shiny (2% chance)
    std::uniform_int_distribution<> shinyDist(1, 100);
    bool isShiny = (shinyDist(rng) <= 1);  // 2% probability
    
    // Get details for the selected Pokemon
    json pokemonDetails = getPokemonDetails(selectedPokemonId);
    
    // Create response with relevant Pokemon data
    json response = {
        {"id", selectedPokemonId},
        {"name", pokemonDetails.value("name", "unknown")},
        {"zone", zone},
        {"isShiny", isShiny}  // Add the shiny status to the response
    };
    
    // Add sprites if available
    if (pokemonDetails.contains("sprites")) {
        if (isShiny && pokemonDetails["sprites"].contains("front_shiny")) {
            // Use shiny sprite if Pokemon is shiny and sprite is available
            response["sprite"] = pokemonDetails["sprites"].value("front_shiny", "");
        } else {
            // Use default sprite otherwise
            response["sprite"] = pokemonDetails["sprites"].value("front_default", "");
        }
    }
    
    // Add types
    if (pokemonDetails.contains("types")) {
        json pokemonTypes = json::array();
        for (const auto& type : pokemonDetails["types"]) {
            pokemonTypes.push_back(type["type"]["name"]);
        }
        response["types"] = pokemonTypes;
    }
    
    // Add basic stats
    if (pokemonDetails.contains("stats")) {
        json stats = json::object();
        for (const auto& stat : pokemonDetails["stats"]) {
            std::string statName = stat["stat"]["name"];
            int baseValue = stat["base_stat"];
            stats[statName] = baseValue;
        }
        response["stats"] = stats;
    }
    
    return response;
}