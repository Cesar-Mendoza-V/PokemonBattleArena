package com.backend.pokemon.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuration class for Spring Security.
 * 
 * What is this class? Think of it like the security plan for a building.
 * 
 * This class establishes all the security rules for the application, including:
 * - Which areas (URLs) anyone can access without identification
 * - Which areas require a security badge (authentication)
 * - How to check if ID cards (JWT tokens) are valid
 * - How to encrypt and check passwords
 * - How to handle requests from different websites (CORS)
 */
@Configuration // Marks this as a configuration class that Spring will process at startup
@EnableWebSecurity // Tells Spring to apply the security rules defined here
@RequiredArgsConstructor // Automatically creates a constructor for required final fields
public class SecurityConfig {

    private final JwtTokenProvider tokenProvider; // The service that creates and validates JWT tokens
    private final CustomUserDetailsService userDetailsService; // The service that loads user data

    /**
     * Set up the authentication provider.
     * 
     * This is like telling security guards how to verify employee ID badges:
     * 1. Look up the employee in the system using the userDetailsService
     * 2. Verify their password using the passwordEncoder
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // How to look up users
        authProvider.setPasswordEncoder(passwordEncoder()); // How to verify passwords
        return authProvider;
    }

    /**
     * Configure the main security filter chain.
     * 
     * This is like creating the master security plan for a building:
     * - Which doors are open to the public
     * - Which areas need a security badge
     * - What kind of security checks to perform
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF protection (not needed for stateless API)
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Configure cross-origin requests
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Don't create sessions
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**").permitAll() // Anyone can access auth endpoints (login/register)
                .requestMatchers("/public/**").permitAll() // Anyone can access public endpoints
                .anyRequest().authenticated() // All other endpoints require authentication
            )
            .authenticationProvider(authenticationProvider()) // Use our authentication provider
            .addFilterBefore(new JwtAuthenticationFilter(tokenProvider), 
                            UsernamePasswordAuthenticationFilter.class); // Check JWT tokens before processing requests
        
        return http.build();
    }

    /**
     * Create the authentication manager.
     * 
     * This is like the head of security who oversees the authentication process.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Create a password encoder.
     * 
     * This is like a special machine that converts regular passwords into encrypted codes.
     * We use BCrypt, which is a secure one-way encryption algorithm.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * Configure Cross-Origin Resource Sharing (CORS).
     * 
     * This is like setting up rules for international visitors to the building:
     * - Which countries (origins) can send visitors
     * - What kind of requests they can make
     * - What identification they need to provide
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*")); // Allow requests from any origin
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")); // Allow these HTTP methods
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type")); // Allow these request headers
        configuration.setExposedHeaders(List.of("Authorization")); // Allow browsers to access these response headers
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply these rules to all paths
        return source;
    }
}
