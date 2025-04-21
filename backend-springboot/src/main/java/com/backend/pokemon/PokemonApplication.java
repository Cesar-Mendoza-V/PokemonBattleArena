package com.backend.pokemon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.backend.pokemon.config.JwtConfig;

/**
 * Main application class for the Pokemon Battle Arena application.
 * 
 * What is this class? Think of it like the ignition switch for a car.
 * 
 * This class is the starting point for the entire application. When you run this class,
 * it starts up the Spring Boot framework, which then loads all the other components
 * (controllers, services, repositories, etc.) and makes your application ready to handle requests.
 * 
 * It's like turning the key to start the engine - once this runs, everything else comes to life!
 */
@SpringBootApplication // Enables Spring Boot's auto-configuration and component scanning
@EnableConfigurationProperties(JwtConfig.class) // Tells Spring to load properties into the JwtConfig class
public class PokemonApplication {

    /**
     * The main method that starts the application.
     * 
     * This is the actual "ignition" method that Spring Boot calls to start everything up.
     * 
     * @param args Command-line arguments (usually not used)
     */
    public static void main(String[] args) {
        SpringApplication.run(PokemonApplication.class, args);
    }
}
