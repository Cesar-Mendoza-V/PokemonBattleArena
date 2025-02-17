#pragma once

#include <memory>           // For std::unique_ptr
#include <mysql_connection.h>

#include "database/db_config.hpp"
#include "models/user.hpp"

// DatabaseManager is responsible for handling all database operations
// including user creation, connection management, and error handling.
// This class serves as an abstraction layer between the application
// and the underlying MySQL database.
//
// Example usage:
//   DatabaseManager db;
//   User new_user{"username", "email@example.com", "password"};
//   if (db.create_user(new_user)) {
//      User created successfully
//   }
class DatabaseManager {
 public:
  // Constructor initializes the database connection and ensures
  // the required database structure exists. It will:
  // 1. Establish connection to MySQL using the configuration
  // 2. Create the users table if it doesn't exist
  // 3. Throw an exception if connection fails
  DatabaseManager();

  // Creates a new user in the database.
  // Thread-safe method that handles user creation with proper
  // error checking and constraint validation.
  //
  // Args:
  //   user: A User object containing the user information to store
  //
  // Returns:
  //   bool: true if user was created successfully
  //
  // Throws:
  //   std::runtime_error: If user creation fails (e.g., duplicate email/username)
  //   sql::SQLException: If there's a database connection error
  bool create_user(const User& user);

  bool login_user(const User& user);

 private:
  // Manages the lifetime of the database connection
  // Using unique_ptr ensures proper resource cleanup
  std::unique_ptr<sql::Connection> conn;

  // Database configuration parameters
  // Contains connection details like host, user, password, and database name
  DBConfig config;
};

