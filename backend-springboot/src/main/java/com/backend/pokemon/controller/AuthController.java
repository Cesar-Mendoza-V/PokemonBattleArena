package com.backend.pokemon.controller;

import com.backend.pokemon.dto.ApiResponse;
import com.backend.pokemon.dto.JwtResponse;
import com.backend.pokemon.dto.LoginRequest;
import com.backend.pokemon.dto.SignupRequest;
import com.backend.pokemon.dto.SendResetCodeRequest;
import com.backend.pokemon.dto.VerifyCodeRequest;
import com.backend.pokemon.entity.User;
import com.backend.pokemon.exception.ResourceAlreadyExistsException;
import com.backend.pokemon.service.AuthService;
import com.backend.pokemon.service.EmailService;
import com.backend.pokemon.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.pokemon.exception.ResourceNotFoundException;
import java.time.LocalDateTime;

/**
 * Controller for authentication endpoints.
 * 
 * What's a controller? Think of it like a receptionist at a hotel who handles
 * specific kinds of requests from users (like checking in or out).
 * 
 * This controller specifically handles user login and registration requests.
 * It receives data from the frontend app and sends appropriate responses back.
 */
@RestController // Tells Spring this class will handle web requests and return data (not web
                // pages)
@RequestMapping("/auth") // All URLs handled by this controller will start with "/api/auth"
@RequiredArgsConstructor
@Slf4j // Automatically creates a constructor for required final fields (authService)
public class AuthController {

    private final AuthService authService; // The service that will do the actual authentication work
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Register a new user.
     * 
     * This is like filling out a membership form at a gym - you provide your
     * details,
     * and if everything looks good, you get signed up as a new member.
     * 
     * @param signUpRequest Contains user registration details (username, email,
     *                      password)
     * @return A message telling you if registration worked or why it failed
     */
    @PostMapping("/signup") // This method handles POST requests to "/api/auth/signup"
    public ResponseEntity<ApiResponse<String>> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            // Ask the auth service to create a new user with the provided details
            User user = authService.registerUser(signUpRequest);

            // If successful, return HTTP 200 (OK) with a success message
            return ResponseEntity.ok(ApiResponse.success(
                    "User registered successfully!", user.getUsername()));
        } catch (ResourceAlreadyExistsException e) {
            // If username/email already exists, return HTTP 409 (Conflict) with error
            // message
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            // For any other errors, return HTTP 500 (Server Error)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred during registration"));
        }
    }

    /**
     * Authenticate a user (log them in).
     * 
     * This is like checking in at a hotel - you provide your ID and booking
     * details,
     * and if they match what's in the system, you get a room key (JWT token).
     * 
     * @param loginRequest Contains login credentials (email and password)
     * @return If successful, returns a JWT token (like a digital ID card) that the
     *         user can use for future requests
     */
    @PostMapping("/login") // This method handles POST requests to "/api/auth/login"
    public ResponseEntity<ApiResponse<JwtResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Try to authenticate the user with provided credentials
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);

            // If successful, return HTTP 200 (OK) with the JWT token and user details
            return ResponseEntity.ok(ApiResponse.success(
                    "Login successful", jwtResponse));
        } catch (Exception e) {
            // If authentication fails, return HTTP 401 (Unauthorized)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid username or password"));
        }
    }

    /**
     * Sends verification code through email.
     * 
     * In case the user forgets its password, this will help them
     * 
     * @param sendResetCodeRequest Contains email
     * @return If successful, returns a succesful message that the email was sent.
     */
    @PostMapping("/send-reset-code") // This method handles POST requests to "/api/auth/send-reset-code"
    public ResponseEntity<ApiResponse<String>> sendResetCode(
            @Valid @RequestBody SendResetCodeRequest sendResetCodeRequest) {
        log.info("Trying to send verification code with email: {}", sendResetCodeRequest.getEmail());
        try {
            // Search the user by the email
            User user = userRepository.findByEmail(sendResetCodeRequest.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No user found with email: " + sendResetCodeRequest.getEmail()));

            // Generate 6 digit code
            String code = String.valueOf((int) (Math.random() * 900000) + 100000);

            //encode the password
            String encodedCode = passwordEncoder.encode(code);

            // Save inside the user
            user.setResetToken(encodedCode);
            user.setResetTokenExpiration(LocalDateTime.now().plusMinutes(10));
            user.setResetTokenUsed(false);
            userRepository.save(user);

            // Send verification code via email
            emailService.sendVerificationCode(sendResetCodeRequest.getEmail(), code);

            log.info("Verification code sent successfully!", user.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Verification code sent successfully!", user.getEmail()));
        } catch (ResourceNotFoundException e) {
            log.info("An error occurred while sending the verification code");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.info("An error occurred while sending the verification code");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while sending the verification code"));
        }
    }

    /**
     * Validates users enters the same code as the one in the database.
     * 
     * In case the user forgets its password, this will help them
     * 
     * @param sendResetCodeRequest Contains email
     * @return If successful, returns a succesful message that the code is correct.
     */
    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse<String>> verifyCode(
            @Valid @RequestBody VerifyCodeRequest verifyCodeRequest) {
        log.info("Trying to validate verification code with email: {}", verifyCodeRequest.getEmail());
        try {
            // Find user by email
            User user = userRepository.findByEmail(verifyCodeRequest.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No user found with email: " + verifyCodeRequest.getEmail()));

            // Check if the token was already used
            if (Boolean.TRUE.equals(user.isResetTokenUsed())) {
                log.info("Token has already been used.");
                return ResponseEntity.badRequest().body(ApiResponse.error("Token has already been used."));
            }

            // Check if the token has expired
            if (user.getResetTokenExpiration() == null || user.getResetTokenExpiration().isBefore(LocalDateTime.now())) {
                log.info("Verification code has expired.");
                return ResponseEntity.badRequest().body(ApiResponse.error("Verification code has expired."));
            }

            // Check if the entered code matches the encrypted one
            if (!passwordEncoder.matches(verifyCodeRequest.getCode(), user.getResetToken())) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid verification code."));
            }

            // Mark token as used
            user.setResetTokenUsed(true);
            userRepository.save(user);

            log.info("Verification code validated successfully for {}", user.getEmail());
            return ResponseEntity.ok(ApiResponse.success("Verification code validated successfully.", user.getEmail()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error while verifying the code", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An error occurred while verifying the code"));
        }
    }

    /**
     * Cierra la sesión del usuario invalidando su token JWT.
     * 
     * Este endpoint recibe el token del usuario y lo añade a la blacklist
     * para que no pueda ser utilizado en futuras peticiones, efectivamente
     * cerrando la sesión del usuario.
     * 
     * @param authHeader El encabezado de autorización que contiene el token JWT
     * @return Un mensaje indicando el resultado de la operación de logout
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logoutUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        log.info("Procesando solicitud de logout");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("No se proporcionó un token válido"));
        }
        
        try {
            // Extraer el token del encabezado de autorización
            String token = authHeader.substring(7); // Eliminar "Bearer "
            
            // Invalidar el token añadiéndolo a la blacklist
            authService.invalidateToken(token);
            
            return ResponseEntity.ok(ApiResponse.success("Logout exitoso", null));
        } catch (Exception e) {
            log.error("Error durante el proceso de logout", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error durante el proceso de logout"));
        }
    }

}
