package com.backend.pokemon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * DTO for JWT authentication response.
 */
@Data
@Builder
@AllArgsConstructor
public class JwtResponse {
    
    private String accessToken;
    private String tokenType;
    private Long userId;
    private String username;
    private String email;
    private String role;
}
