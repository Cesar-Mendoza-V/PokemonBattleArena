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
    }
  );

  
  CROW_ROUTE(app, "/login").methods(crow::HTTPMethod::POST)(
    [&db](const crow::request& req) {
      auto body = crow::json::load(req.body);

      // Verify all required fields are present in the request
      if (!body.has("username") || !body.has("password")) {
        ApiResponse response {
            "Missing required fields in request",
            400
        };
        return crow::response(400, response.ToJson());
      }

      User user {
        body["username"].s(),
        body["email"].s(),
        body["password"].s()
      };
      
      try {
        if (db.login_user(user)) {
          ApiResponse response{
                "User successfully login",
                201
            };
            return crow::response(201, response.ToJson());
        }
      } catch (const std::runtime_error& e) {
        // Handle specific database errors (like duplicate users)
        ApiResponse response{e.what(), 409};
        return crow::response(409, response.ToJson());
      }
    }
  );

  CROW_ROUTE(app, "/verify_code").methods(crow::HTTPMethod::POST)(
    [&db](const crow::request& req) {
        auto body = crow::json::load(req.body);
  
        // Verificar si los campos requeridos están presentes en la solicitud
        if (!body.has("email") || !body.has("verification_code")) {
            ApiResponse response{
                "Missing required fields in request, error raro",
                400
            };
            return crow::response(400, response.ToJson());
        }
  
        std::string email = body["email"].s();
        std::string verification_code = body["verification_code"].s();
  
        try {
            // Validar el código en la base de datos
            if (db.validate_verification_code(email, verification_code)) {
                ApiResponse response{
                    "Verification successful",
                    200
                };
                return crow::response(200, response.ToJson());
            } else {
                ApiResponse response{
                    "Invalid verification code",
                    401
                };
                return crow::response(401, response.ToJson());
            }
        } catch (const std::runtime_error& e) {
            ApiResponse response{
                e.what(),
                500
            };
            return crow::response(500, response.ToJson());
        }
    }
  );
  


CROW_ROUTE(app, "/send_verification_code").methods(crow::HTTPMethod::POST)(
  [&db](const crow::request& req) {
      auto body = crow::json::load(req.body);

      // Verify all required fields are present in the request
      if (!body.has("email")) {
          ApiResponse response{
              "Missing required field: email",
              400
          };
          return crow::response(400, response.ToJson());
      }

      std::string email = body["email"].s();

      try {
          // Try to send the email with the code
          if (db.send_password_reset_email(email)) {
              ApiResponse response{
                  "Verification code sent successfully",
                  200
              };
              return crow::response(200, response.ToJson());
          } else {
              ApiResponse response{
                  "Failed to send verification code",
                  500
              };
              return crow::response(500, response.ToJson());
          }
      } catch (const std::runtime_error& e) {
          ApiResponse response{
              e.what(),
              500
          };
          return crow::response(500, response.ToJson());
      }
  }
);



  // Start the server on port 3000 with multi-threading enabled
  app.port(3000).multithreaded().run();
  return 0;
}