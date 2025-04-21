package com.backend.pokemon.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

/**
 * Configuration class for JWT (JSON Web Token) settings.
 * 
 * What is JWT? A JWT is like a digital ID card that proves who you are when using the app.
 * This class reads JWT-related settings from the application.properties file.
 * 
 * This class does two main things:
 * 1. Stores the secret key used to sign and verify tokens (like a special password)
 * 2. Stores how long tokens remain valid before expiring (like an ID card expiration date)
 */

@Configuration // Marks this as a configuration class that Spring will process at startup
@ConfigurationProperties(prefix = "jwt") // Tells Spring to look for properties starting with "jwt." in application.properties
@Data // Lombok annotation that automatically creates getters, setters, equals, hashCode methods
public class JwtConfig {
    private String secret;    // The secret key used to sign JWT tokens - like a special stamp proving authenticity
    private long expiration;  // How long (in milliseconds) tokens remain valid before the user needs to log in again
}
