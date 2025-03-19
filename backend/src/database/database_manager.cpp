// Copyright 2024 Pokemon Battle Arena Project
// Implementation of DatabaseManager class that handles all database operations

/**
 * INDEX - SEARCH KEYWORDS
 * ======================
 * [DB_CONSTRUCTOR] - Database manager initialization and table creation
 * [DB_CONNECTION] - Database connection setup and configuration
 * [TABLE_CHECK] - Check if required tables exist in the database
 * [TABLE_CREATION] - Create necessary tables if they don't exist
 * [USER_CREATE] - User registration database operations
 * [USER_CREATE_VALIDATION] - Parameter validation for user creation
 * [USER_CREATE_ERROR] - Error handling for user creation process
 * [USER_LOGIN] - User authentication database operations
 * [USER_LOGIN_VALIDATION] - Credential validation for user login
 * [USER_LOGIN_ERROR] - Error handling for login process
 */

#include "database/database_manager.hpp"
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/prepared_statement.h>
#include <iostream>
#include <memory>
#include <string>

// [DB_CONSTRUCTOR] - Initialize database connection and ensure tables exist
DatabaseManager::DatabaseManager() {
  try {
    // [DB_CONNECTION] - Establish initial database connection
    sql::Driver* driver = get_driver_instance();
    conn.reset(driver->connect(config.host, config.user, config.password));
    conn->setSchema(config.database);
    
    // [TABLE_CHECK] - Check if the users table already exists in the database
    std::unique_ptr<sql::Statement> stmt(conn->createStatement());
    std::unique_ptr<sql::ResultSet> tables(stmt->executeQuery(
        "SELECT COUNT(*) FROM information_schema.tables "
        "WHERE table_schema = '" + std::string(config.database) + "' "
        "AND table_name = 'users'"
    ));
    
    tables->next();
    bool table_exists = tables->getInt(1) > 0;
    
    if (!table_exists) {
      // [TABLE_CREATION] - Create the users table if it doesn't exist
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
      std::cout << "+-----------------------+" << std::endl;
      std::cout << "|    Running backend    |" << std::endl;
      std::cout << "+-----------------------+" << std::endl;
    }
  } catch (sql::SQLException& e) {
    // [DB_CONNECTION_ERROR] - Log detailed SQL error information before re-throwing
    std::cerr << "SQL Error in constructor: " << e.what() << std::endl;
    std::cerr << "MySQL Error Code: " << e.getErrorCode() << std::endl;
    std::cerr << "SQL State: " << e.getSQLState() << std::endl;
    throw;  // Re-throw the exception for higher-level handling
  }
}

// [USER_CREATE] - Create a new user in the database with provided information
bool DatabaseManager::create_user(const User& user) {
  try {
    std::cout << "Attempting to create user: " << user.username << std::endl;
    
    // [USER_CREATE_QUERY] - Prepare the SQL statement with parameterized query for security
    const std::string query =
        "INSERT INTO users (email, username, password) "
        "VALUES (?, ?, ?)";
    
    std::unique_ptr<sql::PreparedStatement> prep_stmt(
        conn->prepareStatement(query)
    );
    
    // [USER_CREATE_PARAMS] - Bind parameters to the prepared statement
    prep_stmt->setString(1, user.email);
    prep_stmt->setString(2, user.username);
    prep_stmt->setString(3, user.password);
    
    // [USER_CREATE_EXECUTE] - Execute the prepared statement
    prep_stmt->execute();
    std::cout << "User created successfully" << std::endl;
    return true;
    
  } catch (sql::SQLException& e) {
    std::cerr << "Error creating user: " << e.what() << std::endl;
    
    // [USER_CREATE_ERROR] - Handle duplicate entry errors (MySQL error code 1062)
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

// [USER_LOGIN] - Authenticate user against database credentials
bool DatabaseManager::login_user(const User& user) {
    try {
        std::cout << "Attempting to login user: " << user.username << std::endl;

        // [USER_LOGIN_QUERY] - SQL query to validate user credentials
        const std::string query =
            "SELECT EXISTS ("
            "   SELECT 1"
            "   FROM users"
            "   WHERE username = ? AND password = ?"
            ") AS is_valid";

        std::unique_ptr<sql::PreparedStatement> prep_stmt(conn->prepareStatement(query));

        // [USER_LOGIN_PARAMS] - Bind parameters to the prepared statement (1-based index)
        prep_stmt->setString(1, user.username);
        prep_stmt->setString(2, user.password);

        // [USER_LOGIN_EXECUTE] - Execute query and check results
        std::unique_ptr<sql::ResultSet> res(prep_stmt->executeQuery());

        if (res->next()) {
            bool is_valid = res->getBoolean("is_valid");
            return is_valid;
        }

        return false;  // User not found or incorrect credentials

    } catch (sql::SQLException& e) {
        // [USER_LOGIN_ERROR] - Log detailed error information
        std::cerr << "Error code: " << e.getErrorCode() << std::endl;
        std::cerr << "SQL state: " << e.getSQLState() << std::endl;
        std::cerr << "Error message: " << e.what() << std::endl;
        throw std::runtime_error("Database error, try again.");
    }
}

bool DatabaseManager::user_exists(int IdUser) {
  try {
      // Use "IdUser" column name to match database schema
      std::unique_ptr<sql::PreparedStatement> prep_stmt(
          conn->prepareStatement("SELECT COUNT(*) FROM users WHERE IdUser = ?")
      );
      
      // Bind parameters
      prep_stmt->setInt(1, IdUser);
      
      // Execute query
      std::unique_ptr<sql::ResultSet> res(prep_stmt->executeQuery());
      
      // Check if user exists
      if (res->next()) {
          return res->getInt(1) > 0;
      }
      
      return false;
  } catch (sql::SQLException &e) {
      std::cerr << "SQL Error: " << e.what() << std::endl;
      return false;
  }
}