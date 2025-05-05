package com.backend.pokemon.security;

import com.backend.pokemon.service.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter to validate JWT tokens on each request.
 * 
 * What is this class? Think of it like a security checkpoint at an airport.
 * 
 * Every time someone tries to access a protected part of the application,
 * this filter checks if they have a valid ID card (JWT token) with them.
 * If they do, it verifies the ID and lets them through. If not, they'll
 * be treated as an anonymous visitor with limited access.
 */
@Slf4j // Adds automatic logging capabilities to this class
@RequiredArgsConstructor // Automatically creates a constructor for required final fields
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider; // The service that verifies tokens
    private final TokenBlacklistService blacklistService; // Service to check if a token is blacklisted

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request, 
            @NonNull HttpServletResponse response, 
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            // Step 1: Extract the JWT token from the request's Authorization header
            String jwt = getJwtFromRequest(request);

            // Step 2: If a token exists, check if it's blacklisted or valid
            if (StringUtils.hasText(jwt)) {
                // First, check if the token is blacklisted
                if (blacklistService.isBlacklisted(jwt)) {
                    log.warn("Attempt to use a blacklisted token");
                } 
                // If not blacklisted, validate the token
                else if (tokenProvider.validateToken(jwt)) {
                    // Get the user information from the token
                    Authentication authentication = tokenProvider.getAuthentication(jwt);
                    // Store the authenticated user in the security context (like a temporary badge)
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception ex) {
            // If something goes wrong during authentication, log the error but let the request continue
            log.error("Could not set user authentication in security context", ex);
        }

        // Pass the request to the next filter in the chain (or to the final destination)
        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT token from request Authorization header.
     * 
     * This is like retrieving an ID card from someone's pocket.
     * The Authorization header should contain "Bearer " followed by the token.
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        // Look for the "Authorization" header in the request
        String bearerToken = request.getHeader("Authorization");
        // If it exists and starts with "Bearer ", extract just the token part
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Skip the "Bearer " prefix (7 characters)
        }
        return null; // No token found
    }
}
