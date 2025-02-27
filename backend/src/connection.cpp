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
 * [SERVER_START] - Server configuration and startup
 */

 #include <crow.h>
 #include <string>
 #include "database/database_manager.hpp"
 #include "models/user.hpp"
 #include <crow/middlewares/cors.h>
 
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
 
 // [MAIN] - Main program entry point and application setup
 int main() {
   // [CROW_INIT] - Initialize the Crow application with core components
   crow::App<crow::CORSHandler> app;
 
   // [CORS_CONFIG] - Configure Cross-Origin Resource Sharing
   auto& cors = app.get_middleware<crow::CORSHandler>();
   
   // [CORS_CONFIG_DETAILS] - Properly configure CORS to allow requests from frontend
   cors
       .global()
       .headers("Content-Type", "Authorization")
       .methods("POST"_method, "GET"_method, "PUT"_method, "DELETE"_method, "OPTIONS"_method)
       .origin("http://localhost:5173")
       .allow_credentials()
       .prefix("/")
       .max_age(86400); // Cache preflight for 24 hours
 
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
 
   // [SERVER_START] - Start the server on port 3000 with multi-threading enabled
   app.port(3000).multithreaded().run();
   return 0;
 }