// Copyright 2024 Pokemon Battle Arena Project
// This file defines the User model that represents user data throughout the application

#pragma once

#include <string>

#include <crow.h>

// The User class represents a user entity in the system.
// It encapsulates all user-related data and provides methods
// for data manipulation and serialization.
class User {
 public:
  // Core user identification and authentication data
  std::string username;  // Unique username for the user
  std::string email;     // User's email address (must be unique)
  std::string password;  // User's password (should be hashed in production)

  // Converts User object to JSON format for API responses
  // Note: password is intentionally excluded from JSON output
  // for security purposes
  //
  // Returns:
  //   crow::json::wvalue: JSON object containing user data
  crow::json::wvalue ToJson() const {
    crow::json::wvalue json;
    json["username"] = username;  // Include username in response
    json["email"] = email;        // Include email in response
    return json;                  // Password is deliberately omitted
  }
};