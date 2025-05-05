package com.backend.pokemon.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.concurrent.TimeUnit;

/**
 * Servicio para gestionar la blacklist de tokens JWT.
 * 
 * Este servicio utiliza Redis para almacenar temporalmente los tokens invalidados
 * cuando un usuario hace logout, evitando que puedan ser utilizados para autenticación
 * hasta que expire su tiempo de vida natural.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistService {

    private final RedisTemplate<String, String> redisTemplate;
    private static final String BLACKLIST_PREFIX = "jwt:blacklist:";

    /**
     * Añade un token a la blacklist.
     * 
     * @param token El token JWT a invalidar
     * @param timeToLiveMillis Tiempo en milisegundos hasta que el token expire naturalmente
     */
    public void addToBlacklist(String token, long timeToLiveMillis) {
        String key = BLACKLIST_PREFIX + token;
        redisTemplate.opsForValue().set(key, "invalidated");
        redisTemplate.expire(key, timeToLiveMillis, TimeUnit.MILLISECONDS);
        log.info("Token añadido a la blacklist. Expirará automáticamente en {} milisegundos", timeToLiveMillis);
    }

    /**
     * Verifica si un token está en la blacklist.
     * 
     * @param token El token JWT a verificar
     * @return true si el token está en la blacklist, false en caso contrario
     */
    public boolean isBlacklisted(String token) {
        Boolean exists = redisTemplate.hasKey(BLACKLIST_PREFIX + token);
        return exists != null && exists;
    }
}