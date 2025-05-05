package com.backend.pokemon.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Configuración para Redis.
 * 
 * Esta clase configura Redis como almacén temporal para la blacklist de tokens JWT.
 * Redis es ideal para este caso porque permite almacenar datos con tiempo de 
 * expiración automático, evitando tener que limpiar manualmente tokens expirados.
 */
@Configuration
public class RedisConfig {
    
    /**
     * Crea un template para interactuar con Redis.
     * 
     * Este bean nos permite realizar operaciones CRUD sobre Redis de forma simple,
     * abstrayendo la complejidad del sistema de almacenamiento.
     * 
     * @param connectionFactory Factor de conexión a Redis
     * @return Un template configurado para trabajar con cadenas de texto
     */
    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        return template;
    }
}