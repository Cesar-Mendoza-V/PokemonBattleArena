package com.backend.pokemon.config;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración para deshabilitar explícitamente Redis en la aplicación.
 * 
 * Esta configuración excluye los componentes de Redis de la autoconfiguración de Spring Boot
 * para evitar errores cuando no se está utilizando Redis en la aplicación.
 */
@Configuration
@EnableAutoConfiguration(exclude = {
    RedisAutoConfiguration.class,
    RedisRepositoriesAutoConfiguration.class
})
public class RedisConfig {
    // Clase vacía para deshabilitar la configuración automática de Redis
}