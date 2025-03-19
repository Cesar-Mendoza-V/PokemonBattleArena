// Copyright 2024 Pokemon Battle Arena Project
// Implementation of the Pokemon generator service

/**
 * INDEX - SEARCH KEYWORDS
 * ======================
 * [GENERATOR_CONFIG] - Configuration and initialization of the Pokemon generator
 * [ZONE_TYPES] - Zone definitions and their corresponding Pokemon types
 * [ZONE_LEVELS] - Zone level ranges configuration
 * [API_REQUESTS] - Functions for interacting with the PokeAPI
 * [POKEMON_FILTER] - Functions to filter Pokemon by type
 * [POKEMON_DETAILS] - Functions to get detailed Pokemon information
 * [RANDOM_GENERATION] - Core random Pokemon generation functionality
 * [MULTIPLE_GENERATION] - Generation of multiple Pokemon in a single encounter
 * [SHINY_CALCULATION] - Calculation of shiny probability
 * [LEVEL_ASSIGNMENT] - Assignment of level based on zone
 * [STAT_CALCULATION] - Calculation of Pokemon stats based on level
 * [RESPONSE_BUILDING] - Building the response JSON with Pokemon data
 * [COOLDOWN_SYSTEM] - Management of encounter cooldowns to prevent spamming
 */

/**
 * AVAILABLE ZONES AND THEIR POKEMON TYPES
 * =======================================
 * forest    - grass, bug, poison       - Levels: 5-15
 * mountain  - rock, ground, fighting   - Levels: 15-30
 * cave      - rock, ground, dark       - Levels: 10-25
 * ocean     - water                    - Levels: 20-35
 * beach     - water, ground            - Levels: 10-20
 * volcano   - fire, rock               - Levels: 30-45
 * meadow    - grass, fairy, normal     - Levels: 5-15
 * city      - normal, electric, poison - Levels: 10-25
 * ruins     - ghost, psychic, rock     - Levels: 25-40
 * jungle    - grass, bug, poison, flying - Levels: 15-30
 * default   - normal (fallback)        - Levels: 5-10
 */

#include "services/pokemon_generator.hpp"
#include <iostream>
#include <algorithm>
#include <ctime>

// [GENERATOR_CONFIG] - Constructor initializes the generator with zone configurations and level ranges
PokemonGenerator::PokemonGenerator()
{
    // Initialize random number generator
    std::random_device rd;
    rng = std::mt19937(rd());

    // [ZONE_TYPES] - Initialize zone type restrictions
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

    // [ZONE_LEVELS] - Initialize zone level ranges
    zoneLevels["forest"] = {1, 10};
    zoneLevels["mountain"] = {15, 30};
    zoneLevels["cave"] = {10, 25};
    zoneLevels["ocean"] = {20, 35};
    zoneLevels["beach"] = {10, 20};
    zoneLevels["volcano"] = {30, 45};
    zoneLevels["meadow"] = {5, 15};
    zoneLevels["city"] = {10, 25};
    zoneLevels["ruins"] = {25, 40};
    zoneLevels["jungle"] = {15, 30};

    // Default level range
    zoneLevels["default"] = {5, 10};

    // [API_INIT] - Initialize CURL globally for API requests
    curl_global_init(CURL_GLOBAL_DEFAULT);
}

// [API_CLEANUP] - Clean up CURL resources when generator is destroyed
PokemonGenerator::~PokemonGenerator()
{
    // Clean up CURL
    curl_global_cleanup();
}

// [API_CALLBACK] - Callback function for CURL to write response data to string
size_t PokemonGenerator::WriteCallback(void *contents, size_t size, size_t nmemb, std::string *s)
{
    size_t newLength = size * nmemb;
    try
    {
        s->append((char *)contents, newLength);
        return newLength;
    }
    catch (std::bad_alloc &e)
    {
        // Handle memory problem
        return 0;
    }
}

// [API_REQUESTS] - Function to fetch data from PokeAPI
json PokemonGenerator::fetchFromPokeAPI(const std::string &endpoint)
{
    CURL *curl;
    CURLcode res;
    std::string readBuffer;

    curl = curl_easy_init();
    if (curl)
    {
        std::string url = "https://pokeapi.co/api/v2/" + endpoint;
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        curl_easy_setopt(curl, CURLOPT_USERAGENT, "PokemonBattleArena/1.0");
        curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);

        res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);

        if (res != CURLE_OK)
        {
            std::cerr << "CURL error: " << curl_easy_strerror(res) << std::endl;
            return json::object();
        }
    }

    try
    {
        return json::parse(readBuffer);
    }
    catch (json::parse_error &e)
    {
        std::cerr << "JSON parse error: " << e.what() << std::endl;
        return json::object();
    }
}

// [POKEMON_FILTER] - Get a list of Pokemon IDs that match the specified types
std::vector<int> PokemonGenerator::getPokemonByTypes(const std::vector<std::string> &types)
{
    std::vector<int> result;

    // [CACHE_CHECK] - Check if we already have this type in cache
    if (types.size() == 1 && typeCache.find(types[0]) != typeCache.end())
    {
        return typeCache[types[0]];
    }

    // [TYPE_FILTER] - For simplicity, we'll just use the first type to filter
    if (!types.empty())
    {
        std::string primaryType = types[0];

        // [CACHE_INIT] - Check cache first, populate if needed
        if (typeCache.find(primaryType) == typeCache.end())
        {
            // [API_TYPE_REQUEST] - Fetch Pokemon of this type from PokeAPI
            json typeData = fetchFromPokeAPI("type/" + primaryType);

            if (!typeData.empty() && typeData.contains("pokemon"))
            {
                std::vector<int> typePokemon;
                for (const auto &entry : typeData["pokemon"])
                {
                    std::string url = entry["pokemon"]["url"];

                    // [URL_PARSING] - Extract Pokemon ID from URL
                    size_t lastSlash = url.find_last_of("/", url.length() - 2);
                    size_t secondLastSlash = url.find_last_of("/", lastSlash - 1);
                    std::string idStr = url.substr(secondLastSlash + 1, lastSlash - secondLastSlash - 1);

                    try
                    {
                        int id = std::stoi(idStr);
                        // [GEN1_FILTER] - Limit to original 151 Pokemon for simplicity
                        if (id <= 151)
                        {
                            typePokemon.push_back(id);
                        }
                    }
                    catch (...)
                    {
                        // Skip if ID parsing fails
                    }
                }
                typeCache[primaryType] = typePokemon;
            }
        }

        result = typeCache[primaryType];
    }

    // [FALLBACK_LIST] - If no Pokemon found, return a default list (first 151 Pokemon)
    if (result.empty())
    {
        for (int i = 1; i <= 151; i++)
        {
            result.push_back(i);
        }
    }

    return result;
}

// [POKEMON_DETAILS] - Get detailed information about a specific Pokemon by its ID
json PokemonGenerator::getPokemonDetails(int pokemonId)
{
    return fetchFromPokeAPI("pokemon/" + std::to_string(pokemonId));
}

// [RANDOM_GENERATION] - Generate a random Pokemon based on the specified zone
json PokemonGenerator::generateRandomPokemon(const std::string &zone)
{
    // [ZONE_TYPE_LOOKUP] - Find zone type restrictions
    auto it = zoneTypes.find(zone);
    std::vector<std::string> types;

    if (it != zoneTypes.end())
    {
        types = it->second;
    }
    else
    {
        types = zoneTypes["default"];
    }

    // [FILTERED_POOL] - Get Pokemon of these types
    std::vector<int> possiblePokemon = getPokemonByTypes(types);

    if (possiblePokemon.empty())
    {
        // [FALLBACK_POKEMON] - Fallback to first 151 if no Pokemon found
        for (int i = 1; i <= 151; i++)
        {
            possiblePokemon.push_back(i);
        }
    }

    // [RANDOM_SELECTION] - Select a random Pokemon from the list
    std::uniform_int_distribution<> dist(0, possiblePokemon.size() - 1);
    int selectedIndex = dist(rng);
    int selectedPokemonId = possiblePokemon[selectedIndex];

    // [SHINY_CALCULATION] - Determine if Pokemon is shiny (2% chance)
    std::uniform_int_distribution<> shinyDist(1, 100);
    bool isShiny = (shinyDist(rng) <= 2); // 2% probability

    // [LEVEL_ASSIGNMENT] - Determine Pokemon level based on zone
    int minLevel = 5;
    int maxLevel = 15;
    auto levelIt = zoneLevels.find(zone);
    if (levelIt != zoneLevels.end())
    {
        minLevel = levelIt->second.min;
        maxLevel = levelIt->second.max;
    }
    std::uniform_int_distribution<> levelDist(minLevel, maxLevel);
    int level = levelDist(rng);

    // [API_POKEMON_DETAILS] - Get details for the selected Pokemon
    json pokemonDetails = getPokemonDetails(selectedPokemonId);

    // [RESPONSE_BUILDING] - Create response with relevant Pokemon data
    json response = {
        {"id", selectedPokemonId},
        {"name", pokemonDetails.value("name", "unknown")},
        {"zone", zone},
        {"isShiny", isShiny},
        {"level", level}};

    // [SPRITE_SELECTION] - Add sprites if available
    if (pokemonDetails.contains("sprites"))
    {
        if (isShiny && pokemonDetails["sprites"].contains("front_shiny"))
        {
            // Use shiny sprite if Pokemon is shiny and sprite is available
            response["sprite"] = pokemonDetails["sprites"].value("front_shiny", "");
        }
        else
        {
            // Use default sprite otherwise
            response["sprite"] = pokemonDetails["sprites"].value("front_default", "");
        }
    }

    // [TYPE_INFORMATION] - Add types
    if (pokemonDetails.contains("types"))
    {
        json pokemonTypes = json::array();
        for (const auto &type : pokemonDetails["types"])
        {
            pokemonTypes.push_back(type["type"]["name"]);
        }
        response["types"] = pokemonTypes;
    }

    // [STAT_CALCULATION] - Add basic stats (adjusted for level)
    if (pokemonDetails.contains("stats"))
    {
        json stats = json::object();
        for (const auto &stat : pokemonDetails["stats"])
        {
            std::string statName = stat["stat"]["name"];
            int baseValue = stat["base_stat"];

            // [STAT_FORMULA] - Simple formula to scale stat based on level (similar to Pokemon games)
            int adjustedValue = (2 * baseValue * level) / 100 + 5;
            if (statName == "hp")
            {
                adjustedValue = (2 * baseValue * level) / 100 + level + 10;
            }

            stats[statName] = adjustedValue;
        }
        response["stats"] = stats;
    }

    return response;
}

// [MULTIPLE_GENERATION] - Generate multiple random Pokemon based on the specified zone
json PokemonGenerator::generateMultiplePokemon(const std::string &zone, int IdUser, int maxCount)
{
    // [COOLDOWN_CHECK] - Check if we're still in cooldown period for this zone/user combination
    auto now = std::chrono::system_clock::now();
    
    // [USER_SPECIFIC_CACHE] - Create a unique cache key for each user/zone combination
    std::string cache_key = zone + "_user" + std::to_string(IdUser);

    // If we have a cached encounter for this zone/user
    if (encounter_cache.find(cache_key) != encounter_cache.end())
    {
        auto &cached_data = encounter_cache[cache_key];
        auto elapsed = std::chrono::duration_cast<std::chrono::seconds>(
                           now - cached_data.last_encounter)
                           .count();

        // If not enough time has passed, return the cached result
        if (elapsed < ENCOUNTER_COOLDOWN_SECONDS)
        {
            // Return the cached response without adding cooldown information
            return cached_data.pokemon_data;
        }
    }

    // [ENCOUNTER_COUNT] - Determine how many Pokemon to generate (0-maxCount)
    std::uniform_int_distribution<> countDist(0, maxCount);
    int pokemonCount = countDist(rng);

    // [RESULT_ARRAY] - Create array to hold Pokemon data
    json pokemonArray = json::array();

    // [POKEMON_GENERATION] - Generate the determined number of Pokemon
    for (int i = 0; i < pokemonCount; i++)
    {
        json pokemon = generateRandomPokemon(zone);
        pokemonArray.push_back(pokemon);
    }

    // [RESPONSE_BUILDING] - Create the final response with metadata (without cooldown info)
    json response = {
        {"zone", zone},
        {"pokemon", pokemonArray}
    };

    // [COOLDOWN_UPDATE] - Store the result and timestamp for future cooldown checks
    encounter_cache[cache_key] = {response, now};

    return response;
}