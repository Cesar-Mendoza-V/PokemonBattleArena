// Copyright 2024 Pokemon Battle Arena Project
// Main server file that implements the REST API for user registration

#include <crow.h>

#include <string>

#include "database/database_manager.hpp"

#include "models/user.hpp"

// ApiResponse defines the standard structure for all API responses.
// Used to maintain consistent communication format with the frontend.
class ApiResponse {
 public:
  // Human-readable message describing the operation result
  std::string message;
  
  // Standard HTTP status code indicating the type of response
  int http_status_code;

  // Converts the ApiResponse object to a JSON format suitable for HTTP responses
  crow::json::wvalue ToJson() const {
    crow::json::wvalue response;
    response["httpStatusCode"] = http_status_code;
    response["message"] = message;
    return response;
  }
};



int main() {
  // Initialize the Crow application with core components
  crow::App<> app;
  
  // Set logging level to only show warnings and suppress info messages
  app.loglevel(crow::LogLevel::Warning);
  
  // Initialize database connection manager
  DatabaseManager db;

  // Health check endpoint to verify API is operational
  CROW_ROUTE(app, "/")([]() {
    return "Registration API is operational";
  });

  // User registration endpoint - handles new user creation
  CROW_ROUTE(app, "/signup").methods(crow::HTTPMethod::POST)(
    [&db](const crow::request& req) {
      try {
        // Parse the incoming JSON request body
        auto body = crow::json::load(req.body);

        // Verify all required fields are present in the request
        if (!body.has("username") || !body.has("email") || 
            !body.has("password")) {
          ApiResponse response{
              "Missing required fields in request",
              400
          };
          return crow::response(400, response.ToJson());
        }

        // Create user object from the validated request data
        User user{
            body["username"].s(),
            body["email"].s(),
            body["password"].s()
        };

        // Validate email format (basic check for @ symbol)
        if (user.email.find('@') == std::string::npos) {
          ApiResponse response{
              "Invalid email format",
              400
          };
          return crow::response(400, response.ToJson());
        }

        try {
          // Attempt to create the user in the database
          if (db.create_user(user)) {
            ApiResponse response{
                "User successfully registered",
                201
            };
            return crow::response(201, response.ToJson());
          }
        } catch (const std::runtime_error& e) {
          // Handle specific database errors (like duplicate users)
          ApiResponse response{e.what(), 409};
          return crow::response(409, response.ToJson());
        }
      } catch (const std::exception& e) {
        // Handle malformed JSON or general parsing errors
        ApiResponse response{
            "Invalid request format",
            400
        };
        return crow::response(400, response.ToJson());
      }

      // Handle unexpected server errors
      ApiResponse response{
          "Internal server error",
          500
      };
      return crow::response(500, response.ToJson());
    });

  // Start the server on port 3000 with multi-threading enabled
  app.port(3000).multithreaded().run();
  return 0;
}