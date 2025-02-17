// Copyright 2024 Pokemon Battle Arena Project
// Implementation of DatabaseManager class that handles all database operations

#include "database/database_manager.hpp"
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/prepared_statement.h>
#include <iostream>
#include <memory>
#include <string>

DatabaseManager::DatabaseManager() {
  try {
    // Establish initial database connection
    std::cout << "Attempting to connect to database..." << std::endl;
    sql::Driver* driver = get_driver_instance();
    conn.reset(driver->connect(config.host, config.user, config.password));
    conn->setSchema(config.database);
    
    // Check if the users table already exists in the database
    std::unique_ptr<sql::Statement> stmt(conn->createStatement());
    std::unique_ptr<sql::ResultSet> tables(stmt->executeQuery(
        "SELECT COUNT(*) FROM information_schema.tables "
        "WHERE table_schema = '" + std::string(config.database) + "' "
        "AND table_name = 'users'"
    ));
    
    tables->next();
    bool table_exists = tables->getInt(1) > 0;
    
    if (!table_exists) {
      // Create the users table if it doesn't exist
      std::cout << "Creating 'users' table..." << std::endl;
      stmt->execute(
          "CREATE TABLE users ("
          "IdUser INT AUTO_INCREMENT PRIMARY KEY,"
          "email VARCHAR(255) UNIQUE NOT NULL,"
          "username VARCHAR(255) UNIQUE NOT NULL,"
          "password VARCHAR(255) NOT NULL"
          ")"
      );
      std::cout << "Successfully created 'users' table" << std::endl;
    } else {
      std::cout << "Successfully connected to existing 'users' table" 
                << std::endl;
    }
  } catch (sql::SQLException& e) {
    // Log detailed SQL error information before re-throwing
    std::cerr << "SQL Error in constructor: " << e.what() << std::endl;
    std::cerr << "MySQL Error Code: " << e.getErrorCode() << std::endl;
    std::cerr << "SQL State: " << e.getSQLState() << std::endl;
    throw;  // Re-throw the exception for higher-level handling
  }
}

bool DatabaseManager::create_user(const User& user) {
  try {
    std::cout << "Attempting to create user: " << user.username << std::endl;
    
    // Prepare the SQL statement with parameterized query for security
    const std::string query =
        "INSERT INTO users (email, username, password) "
        "VALUES (?, ?, ?)";
    
    std::unique_ptr<sql::PreparedStatement> prep_stmt(
        conn->prepareStatement(query)
    );
    
    // Bind parameters to the prepared statement
    prep_stmt->setString(1, user.email);
    prep_stmt->setString(2, user.username);
    prep_stmt->setString(3, user.password);
    
    // Execute the prepared statement
    prep_stmt->execute();
    std::cout << "User created successfully" << std::endl;
    return true;
    
  } catch (sql::SQLException& e) {
    std::cerr << "Error creating user: " << e.what() << std::endl;
    
    // Handle duplicate entry errors (MySQL error code 1062)
    if (e.getErrorCode() == 1062) {
      // Check which unique constraint was violated
      if (std::string(e.what()).find("username") != std::string::npos) {
        throw std::runtime_error("Username is already taken");
      }
      if (std::string(e.what()).find("email") != std::string::npos) {
        throw std::runtime_error("Email is already registered");
      }
      throw std::runtime_error("User or email already exists in the system");
    }
    
    // Handle other database errors
    throw std::runtime_error("Error connecting to database");
  }
}

bool DatabaseManager::login_user(const User& user) {
    try {
        std::cout << "Attempting to login user: " << user.username << std::endl;

        const std::string query =
            "SELECT EXISTS ("
            "   SELECT 1"
            "   FROM users"
            "   WHERE username = ? AND password = ?"
            ") AS is_valid";

        std::unique_ptr<sql::PreparedStatement> prep_stmt(conn->prepareStatement(query));

        // Corrected parameter indices (1-based index)
        prep_stmt->setString(1, user.username);
        prep_stmt->setString(2, user.password);

        std::unique_ptr<sql::ResultSet> res(prep_stmt->executeQuery());

        if (res->next()) {
            bool is_valid = res->getBoolean("is_valid");
            return is_valid;
        }

        return false;  // User not found or incorrect credentials

    } catch (sql::SQLException& e) {
        std::cerr << "Error code: " << e.getErrorCode() << std::endl;
        std::cerr << "SQL state: " << e.getSQLState() << std::endl;
        std::cerr << "Error message: " << e.what() << std::endl;
        throw std::runtime_error("Database error, try again.");
    }
}
