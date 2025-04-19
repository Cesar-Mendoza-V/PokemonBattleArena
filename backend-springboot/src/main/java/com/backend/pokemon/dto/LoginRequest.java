package com.backend.pokemon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for user login requests.
 */
@Data
public class LoginRequest {
    
    @NotBlank
    private String email;
    
    @NotBlank
    private String password;
}
