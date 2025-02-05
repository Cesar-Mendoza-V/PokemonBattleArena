#pragma once
#include <string>
#include <fstream>
#include <stdexcept>

class EnvLoader {
public:
    static std::string getEnvVariable(const std::string& key, const std::string& defaultValue = "") {
        std::ifstream file("../.env"); // Locates the .env file that will be read
        std::string line;
        
        while (std::getline(file, line)) {
            // Ignores empty lines or comments
            if (line.empty() || line[0] == '#') continue;
            
            // Searchs for equal sign
            auto pos = line.find('=');
            if (pos == std::string::npos) continue;
            
            // Extracts the key and Value
            std::string currentKey = line.substr(0, pos);
            if (currentKey == key) {
                return line.substr(pos + 1);
            }
        }
        
        return defaultValue;
    }
};