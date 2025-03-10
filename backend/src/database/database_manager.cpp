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
          "password VARCHAR(255) NOT NULL,"
          "verification_code VARCHAR(6)"
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

// Method to send the email with the verification code
bool DatabaseManager::send_password_reset_email(const std::string& email) {
  try {
    // Generate 6 digit code 
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<int> dist(100000, 999999);
    std::string verification_code = std::to_string(dist(gen));

    // Query to validate the user 
    const std::string query = "UPDATE users SET verification_code = ? WHERE email = ?";

    // Execute the query 
    std::unique_ptr<sql::PreparedStatement> prep_stmt(conn->prepareStatement(query));
    prep_stmt->setString(1, verification_code);
    prep_stmt->setString(2, email);
    prep_stmt->execute(); 

    // Execute python's script to send email
    std::string command = "python3 ../modules/send_email.py " + email + " " + verification_code;
    int exit_code = system(command.c_str());

    if (exit_code != 0) {
        std::cerr << "Error: Python script failed." << std::endl;
        return false;
    }

    std::cout << "Verification code sent correctly." << std::endl;
    return true;

  } catch (const sql::SQLException& e) {
      std::cerr << "Error trying to send the email " << e.what() << std::endl;
      return false;
  }
}

// Method to validate if the verification code is correct
bool DatabaseManager::validate_verification_code(const std::string& email, const std::string& code) {
  try {
      std::cout << "Validating verification code for: " << email << std::endl;

      // Check if the database connection is valid
      if (!conn) {
          throw std::runtime_error("Database connection is null.");
      }

      const std::string query = 
          "SELECT COUNT(*) FROM users WHERE email = ? AND verification_code = ?";

      std::unique_ptr<sql::PreparedStatement> prep_stmt(conn->prepareStatement(query));
      prep_stmt->setString(1, email);
      prep_stmt->setString(2, code);

      std::unique_ptr<sql::ResultSet> res(prep_stmt->executeQuery());

      if (res->next()) {
          int count = res->getInt(1);
          return count > 0;  // Returns true if at least one match is found
      }

      return false;  // No matching record

  } catch (const sql::SQLException& e) {
      std::cerr << "SQL Error validating verification code: " << e.what() 
                << " (SQL State: " << e.getSQLState() << ")" << std::endl;
      return false;
  } catch (const std::exception& e) {
      std::cerr << "General error: " << e.what() << std::endl;
      return false;
  }
}

bool DatabaseManager::update_password(const std::string& email, const std::string& new_password) {
  try {
      std::cout << "Updating password for: " << email << std::endl;

      // Verificar que la conexión a la base de datos sea válida
      if (!conn) {
          throw std::runtime_error("Database connection is null.");
      }

      // Consulta para actualizar la contraseña del usuario
      const std::string query = "UPDATE users SET password = ? WHERE email = ?";

      std::unique_ptr<sql::PreparedStatement> prep_stmt(conn->prepareStatement(query));
      prep_stmt->setString(1, new_password); // Se recomienda aplicar hashing antes de almacenar
      prep_stmt->setString(2, email);

      int affected_rows = prep_stmt->executeUpdate();

      return affected_rows > 0;  // Devuelve true si se actualizó al menos una fila

  } catch (const sql::SQLException& e) {
      std::cerr << "SQL Error updating password: " << e.what() 
                << " (SQL State: " << e.getSQLState() << ")" << std::endl;
      return false;
  } catch (const std::exception& e) {
      std::cerr << "General error: " << e.what() << std::endl;
      return false;
  }
}


