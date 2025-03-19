// Copyright 2024 Pokemon Battle Arena Project
// Main server file that implements the REST API for user registration

/**
 * INDEX - SEARCH KEYWORDS
 * ======================
 * [API_RESPONSE] - Standard API response structure
 * [MAIN] - Main program entry point
 * [CROW_INIT] - Crow application initialization
 * [CORS_CONFIG] - CORS configuration settings
 * [DB_INIT] - Database connection initialization
 * [HEALTH_CHECK] - API health check endpoint
 * [SIGNUP_OPTIONS] - Options handler for signup preflight requests
 * [SIGNUP_ENDPOINT] - User registration endpoint implementation
 * [SIGNUP_VALIDATION] - User input validation for registration
 * [SIGNUP_DB] - Database interaction for user creation
 * [LOGIN_OPTIONS] - Options handler for login preflight requests
 * [LOGIN_ENDPOINT] - User login endpoint implementation
 * [LOGIN_VALIDATION] - User input validation for login
 * [LOGIN_DB] - Database interaction for user authentication
 * [POKEMON_ENCOUNTER] - Random Pokemon generation by zone
 * [POKEMON_ENCOUNTER_ENDPOINT] - Endpoint for Pokemon encounters
 * [SERVER_START] - Server configuration and startup
 */

 #include <crow.h>
 #include <string>
 #include "database/database_manager.hpp"
 #include "models/user.hpp"
 #include "services/pokemon_generator.hpp"
 #include <crow/middlewares/cors.h>
 #include <cstdlib>
 #include <fstream>
 #include <iostream>

  // [ENV_LOADER] - Simple function to load environment variables from .env file in parent directory
  void loadEnvFromFile() {
    std::ifstream envFile("../../.env");
    if (!envFile.is_open()) {
        std::cerr << "Warning: Could not open ../.env file" << std::endl;
        return;
    }

    std::string line;
    while (std::getline(envFile, line)) {
        // Skip comments and empty lines
        if (line.empty() || line[0] == '#') continue;
        
        // Find the equals sign
        size_t pos = line.find('=');
        if (pos != std::string::npos) {
            std::string key = line.substr(0, pos);
            std::string value = line.substr(pos + 1);
            
            // Set environment variable
            setenv(key.c_str(), value.c_str(), 1);
        }
    }
  }
 
 // [API_RESPONSE] - Defines the standard structure for all API responses.
 // Used to maintain consistent communication format with the frontend.
 class ApiResponse {
  public:
   // Human-readable message describing the operation result
   std::string message;
   
   // Standard HTTP status code indicating the type of response
   int http_status_code;
 
   // [API_RESPONSE_JSON] - Converts the ApiResponse object to a JSON format suitable for HTTP responses
   crow::json::wvalue ToJson() const {
     crow::json::wvalue response;
     response["httpStatusCode"] = http_status_code;
     response["message"] = message;
     return response;
   }
 };

/**
 * [POKEMON_ENCOUNTER] - Handles generating random Pokemon based on zone
 * Returns between 0 and 5 random Pokemon adapted to the specified zone's type restrictions
 */
crow::response handlePokemonEncounter(const crow::request& req) {
  try {
    // Parse JSON request
    auto bodyArgs = crow::json::load(req.body);
    
    // Validate request has zone field
    if (!bodyArgs.has("zone")) {
      ApiResponse response{
          "Missing zone parameter",
          400
      };
      return crow::response(400, response.ToJson());
    }
    
    std::string zone = bodyArgs["zone"].s();
    
    // Create Pokemon generator (or use a singleton instance)
    static PokemonGenerator pokemonGenerator;
    
    // Generate multiple random Pokemon for this zone (0-5)
    json pokemonData = pokemonGenerator.generateMultiplePokemon(zone);
    
    // Return the Pokemon data with cooldown information
    return crow::response(200, pokemonData.dump());
    
  } catch (const std::exception& e) {
    ApiResponse response{
        "Internal server error: " + std::string(e.what()),
        500
    };
    return crow::response(500, response.ToJson());
  }
}
 
 // [MAIN] - Main program entry point and application setup
 int main() {

   loadEnvFromFile();
   // [CROW_INIT] - Initialize the Crow application with core components
   crow::App<crow::CORSHandler> app;
 
   // [CORS_CONFIG] - Configure Cross-Origin Resource Sharing
   auto& cors = app.get_middleware<crow::CORSHandler>();

   // [ENV_CHECK] - Retrieve ALLOWED_ORIGIN from environment variables
   char* allowed_origin = std::getenv("ALLOWED_ORIGIN");
   if (!allowed_origin) {
    throw std::runtime_error("ALLOWED_ORIGIN environment variable is not set.");
   }
   std::string origin = std::string(allowed_origin);

   
   // [CORS_CONFIG_DETAILS] - Properly configure CORS to allow requests from frontend
   cors
      .global()
      .headers("Content-Type", "Authorization")
      .methods("POST"_method, "GET"_method, "PUT"_method, "DELETE"_method, "OPTIONS"_method)
      .origin(origin)  
      .allow_credentials()
      .prefix("/")
      .max_age(86400);
 
   // [LOGGING] - Set logging level to only show warnings and suppress info messages
   app.loglevel(crow::LogLevel::Warning);
   
   // [DB_INIT] - Initialize database connection manager
   DatabaseManager db;
 
   // [HEALTH_CHECK] - Health check endpoint to verify API is operational
   CROW_ROUTE(app, "/")([]() {
     return "Registration API is operational";
   });
 
   // [SIGNUP_OPTIONS] - Explicitly handle OPTIONS requests (preflight) for signup
   CROW_ROUTE(app, "/signup").methods("OPTIONS"_method)([](const crow::request&) {
     crow::response res(204);
     return res;
   });
 
   // [SIGNUP_ENDPOINT] - User registration endpoint - handles new user creation
   CROW_ROUTE(app, "/signup").methods(crow::HTTPMethod::POST)(
     [&db](const crow::request& req) {
       try {
         // [SIGNUP_PARSE] - Parse the incoming JSON request body
         auto body = crow::json::load(req.body);
 
         // [SIGNUP_VALIDATION] - Verify all required fields are present in the request
         if (!body.has("username") || !body.has("email") || 
             !body.has("password")) {
           ApiResponse response{
               "Missing required fields in request",
               400
           };
           return crow::response(400, response.ToJson());
         }
 
         // [SIGNUP_USER_CREATE] - Create user object from the validated request data
         User user{
             body["username"].s(),
             body["email"].s(),
             body["password"].s()
         };
 
         // [SIGNUP_EMAIL_VALIDATION] - Validate email format (basic check for @ symbol)
         if (user.email.find('@') == std::string::npos) {
           ApiResponse response{
               "Invalid email format",
               400
           };
           return crow::response(400, response.ToJson());
         }
 
         try {
           // [SIGNUP_DB] - Attempt to create the user in the database
           if (db.create_user(user)) {
             ApiResponse response{
                 "User successfully registered",
                 201
             };
             return crow::response(201, response.ToJson());
           }
         } catch (const std::runtime_error& e) {
           // [SIGNUP_DB_ERROR] - Handle specific database errors (like duplicate users)
           ApiResponse response{e.what(), 409};
           return crow::response(409, response.ToJson());
         }
       } catch (const std::exception& e) {
         // [SIGNUP_PARSE_ERROR] - Handle malformed JSON or general parsing errors
         ApiResponse response{
             "Invalid request format",
             400
         };
         return crow::response(400, response.ToJson());
       }
 
       // [SIGNUP_SERVER_ERROR] - Handle unexpected server errors
       ApiResponse response{
           "Internal server error",
           500
       };
       return crow::response(500, response.ToJson());
     }
   );
 
   // [LOGIN_OPTIONS] - Explicitly handle OPTIONS requests for login (preflight)
   CROW_ROUTE(app, "/login").methods("OPTIONS"_method)([](const crow::request&) {
     crow::response res(204);
     return res;
   });
   
   // [LOGIN_ENDPOINT] - User login endpoint implementation
   CROW_ROUTE(app, "/login").methods(crow::HTTPMethod::POST)(
     [&db](const crow::request& req) {
       try {
         // [LOGIN_PARSE] - Parse the incoming JSON request body
         auto body = crow::json::load(req.body);
 
         // [LOGIN_VALIDATION] - Verify all required fields are present in the request
         if (!body.has("username") || !body.has("password")) {
           ApiResponse response {
               "Missing required fields in request",
               400
           };
           return crow::response(400, response.ToJson());
         }
 
         // [LOGIN_DATA_EXTRACT] - Extract credentials from request
         std::string username = body["username"].s();
         std::string password = body["password"].s();
         
         // [LOGIN_USER_CREATE] - Create user object for authentication (no email needed)
         User user {
           username,
           "", // Empty email for login
           password
         };
         
         try {
           // [LOGIN_DB] - Attempt to authenticate the user
           if (db.login_user(user)) {
             ApiResponse response{
                 "User successfully logged in",
                 200
             };
             return crow::response(200, response.ToJson());
           } else {
             // [LOGIN_AUTH_FAILED] - Handle authentication failure
             ApiResponse response{
                 "Invalid username or password",
                 401
             };
             return crow::response(401, response.ToJson());
           }
         } catch (const std::runtime_error& e) {
           // [LOGIN_DB_ERROR] - Handle database errors during login
           ApiResponse response{e.what(), 500};
           return crow::response(500, response.ToJson());
         }
       } catch (const std::exception& e) {
         // [LOGIN_PARSE_ERROR] - Handle malformed JSON or general parsing errors
         ApiResponse response{
             "Invalid request format",
             400
         };
         return crow::response(400, response.ToJson());
       }
     }
   );

   // [POKEMON_ENCOUNTER_ENDPOINT] - Endpoint for generating random Pokemon encounters
   CROW_ROUTE(app, "/api/pokemon/encounter")
     .methods("POST"_method)
     ([](const crow::request& req) {
       return handlePokemonEncounter(req);
     });

   // [POKEMON_ENCOUNTER_OPTIONS] - Options handler for Pokemon encounter preflight requests
   CROW_ROUTE(app, "/api/pokemon/encounter")
     .methods("OPTIONS"_method)
     ([](const crow::request&) {
       crow::response res;
       res.add_header("Access-Control-Allow-Origin", "*");
       res.add_header("Access-Control-Allow-Methods", "POST, OPTIONS");
       res.add_header("Access-Control-Allow-Headers", "Content-Type");
       res.code = 204;
       return res;
     });
 
   // [SERVER_START] - Start the server on port 3000 with multi-threading enabled
   app.port(3000).multithreaded().run();
   return 0;
 }