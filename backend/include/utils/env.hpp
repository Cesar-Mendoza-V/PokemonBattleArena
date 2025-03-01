// Copyright 2024 Pokemon Battle Arena Project
// Utility class for loading environment variables from a .env file

#pragma once
#include <string>
#include <fstream>
#include <stdexcept>

/**
 * [ENV_LOADER] - Utility class for reading environment variables
 * from a .env file located in the parent directory.
 */
class EnvLoader {
public:
    /**
     * [ENV_GET] - Retrieves the value of an environment variable
     * from the .env file. If the variable is not found, returns
     * the provided default value.
     *
     * @param key The environment variable name to search for.
     * @param defaultValue The default value to return if the key is not found.
     * @return The value of the environment variable or the default value.
     */
    static std::string getEnvVariable(const std::string& key, const std::string& defaultValue = "") {
        // [ENV_FILE_OPEN] - Open the .env file for reading
        std::ifstream file("../../../../.env");
        std::string line;
        
        // [ENV_FILE_READ] - Read file line by line
        while (std::getline(file, line)) {
            // [ENV_IGNORE] - Ignore empty lines and comments
            if (line.empty() || line[0] == '#') continue;
            
            // [ENV_PARSE] - Locate the equal sign separating key and value
            auto pos = line.find('=');
            if (pos == std::string::npos) continue;
            
            // [ENV_EXTRACT] - Extract the key and compare it with the requested key
            std::string currentKey = line.substr(0, pos);
            if (currentKey == key) {
                return line.substr(pos + 1);
            }
        }
        
        // [ENV_DEFAULT_RETURN] - Return the default value if key is not found
        return defaultValue;
    }
};
