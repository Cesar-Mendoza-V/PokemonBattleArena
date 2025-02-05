// Copyright 2024 Pokemon Battle Arena Project
// Database configuration settings for MySQL connection management

#pragma once
#include "utils/env.hpp"
#include <string>

struct DBConfig {
    const std::string host = EnvLoader::getEnvVariable("DB_HOST", "");
    const std::string user = EnvLoader::getEnvVariable("DB_USER", "");
    const std::string password = EnvLoader::getEnvVariable("DB_PASSWORD", "");
    const std::string database = EnvLoader::getEnvVariable("DB_NAME", "");
};