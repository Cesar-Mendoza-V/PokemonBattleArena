package com.backend.pokemon.service;

import com.backend.pokemon.dto.EvolutionInfoDTO;
import com.backend.pokemon.dto.EvolutionRequestDTO;
import com.backend.pokemon.dto.EvolutionResultDTO;
import com.backend.pokemon.entity.*;
import com.backend.pokemon.exception.ResourceNotFoundException;
import com.backend.pokemon.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvolutionService {
    
    private final UserPokemonRepository userPokemonRepository;
    private final PokemonRepository pokemonRepository;
    private final PokemonEvolutionRepository evolutionRepository;
    private final EvolutionItemRepository itemRepository;
    private final UserItemRepository userItemRepository;
    private final ObjectMapper objectMapper;
    
    /**
     * Verifica si un Pokémon puede evolucionar y devuelve la información sobre su evolución
     */
    @Transactional(readOnly = true)
    public EvolutionInfoDTO checkEvolutionRequirements(Long userPokemonId) {
        // Obtener el Pokémon del usuario
        UserPokemon userPokemon = userPokemonRepository.findById(userPokemonId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el Pokémon con id " + userPokemonId));
        
        // Obtener la información del Pokémon base
        Pokemon pokemon = pokemonRepository.findById(userPokemon.getPokemonId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró información del Pokémon en la base de datos"));
        
        // Buscar la información de evolución
        Optional<PokemonEvolution> evolutionOpt = evolutionRepository.findByPokemonId(userPokemon.getPokemonId());
        
        // Si no hay evolución disponible, retornar información indicando que no puede evolucionar
        if (evolutionOpt.isEmpty()) {
            return EvolutionInfoDTO.builder()
                    .pokemonId(userPokemon.getPokemonId())
                    .pokemonName(extractPokemonName(pokemon))
                    .currentLevel(userPokemon.getLevel())
                    .canEvolve(false)
                    .reason("Este Pokémon no tiene evolución disponible")
                    .build();
        }
        
        PokemonEvolution evolution = evolutionOpt.get();
        
        // Obtener información del Pokémon evolucionado
        Pokemon evolvedPokemon = pokemonRepository.findById(evolution.getEvolvesToId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró información del Pokémon evolucionado"));
        
        EvolutionInfoDTO.EvolutionInfoDTOBuilder builder = EvolutionInfoDTO.builder()
                .pokemonId(userPokemon.getPokemonId())
                .pokemonName(extractPokemonName(pokemon))
                .currentLevel(userPokemon.getLevel())
                .requiredLevel(evolution.getRequiredLevel())
                .evolvesToName(extractPokemonName(evolvedPokemon))
                .evolvesToId(evolution.getEvolvesToId());
        
        // Verificar si el nivel es suficiente
        boolean hasRequiredLevel = userPokemon.getLevel() >= evolution.getRequiredLevel();
        if (!hasRequiredLevel) {
            return builder
                    .canEvolve(false)
                    .reason("El Pokémon no tiene el nivel requerido para evolucionar")
                    .build();
        }
        
        // Verificar si se requiere item y si el usuario lo tiene
        if (evolution.getRequiredItem() != null) {
            EvolutionItem requiredItem = evolution.getRequiredItem();
            builder
                    .requiresItem(true)
                    .requiredItemName(requiredItem.getName())
                    .requiredItemId(requiredItem.getId());
            
            // Verificar si el usuario tiene el item
            Optional<UserItem> userItemOpt = userItemRepository.findByUserAndItem(userPokemon.getUser(), requiredItem);
            if (userItemOpt.isPresent() && userItemOpt.get().getQuantity() > 0) {
                builder
                        .userHasItem(true)
                        .userItemQuantity(userItemOpt.get().getQuantity())
                        .canEvolve(true);
            } else {
                return builder
                        .userHasItem(false)
                        .userItemQuantity(0)
                        .canEvolve(false)
                        .reason("No tienes el item requerido para la evolución: " + requiredItem.getName())
                        .build();
            }
        } else {
            builder
                    .requiresItem(false)
                    .canEvolve(true);
        }
        
        return builder.build();
    }
    
    /**
     * Realiza la evolución del Pokémon si se cumplen todos los requisitos
     */
    @Transactional
    public EvolutionResultDTO evolvePokemon(EvolutionRequestDTO request) {
        // Primera parte: Verificar si puede evolucionar
        EvolutionInfoDTO evolutionInfo = checkEvolutionRequirements(request.getUserPokemonId());
        
        // Si no puede evolucionar, retornar el error
        if (!evolutionInfo.getCanEvolve()) {
            return EvolutionResultDTO.builder()
                    .success(false)
                    .message(evolutionInfo.getReason())
                    .build();
        }
        
        // Si no se confirmó la evolución, solo retornamos la información
        if (request.getConfirmEvolution() == null || !request.getConfirmEvolution()) {
            return EvolutionResultDTO.builder()
                    .success(false)
                    .message("Debes confirmar que deseas evolucionar a tu Pokémon")
                    .originalPokemonId(evolutionInfo.getPokemonId())
                    .originalPokemonName(evolutionInfo.getPokemonName())
                    .evolvedPokemonId(evolutionInfo.getEvolvesToId())
                    .evolvedPokemonName(evolutionInfo.getEvolvesToName())
                    .itemUsed(evolutionInfo.getRequiresItem() ? evolutionInfo.getRequiredItemName() : null)
                    .build();
        }
        
        // Si llega aquí, se puede evolucionar y se confirmó la acción
        
        // Obtener el Pokémon del usuario
        UserPokemon userPokemon = userPokemonRepository.findById(request.getUserPokemonId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el Pokémon con id " + request.getUserPokemonId()));
        
        // Obtener la evolución
        PokemonEvolution evolution = evolutionRepository.findByPokemonId(userPokemon.getPokemonId())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró información de evolución"));
        
        // Si requiere item, consumirlo
        String itemUsed = null;
        if (evolutionInfo.getRequiresItem()) {
            UserItem userItem = userItemRepository.findByUserAndItem(
                    userPokemon.getUser(), 
                    itemRepository.findById(evolutionInfo.getRequiredItemId())
                            .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"))
            ).orElseThrow(() -> new ResourceNotFoundException("El usuario no posee el item requerido"));
            
            // Verificar que aún tenga el item (por seguridad)
            if (userItem.getQuantity() <= 0) {
                return EvolutionResultDTO.builder()
                        .success(false)
                        .message("Ya no posees el item requerido: " + evolutionInfo.getRequiredItemName())
                        .build();
            }
            
            // Consumir el item
            userItem.setQuantity(userItem.getQuantity() - 1);
            userItemRepository.save(userItem);
            
            itemUsed = evolutionInfo.getRequiredItemName();
            log.info("Item consumido: {} - Cantidad restante: {}", itemUsed, userItem.getQuantity());
        }
        
        // Evolucionar el Pokémon
        userPokemon.setPokemonId(evolution.getEvolvesToId());
        userPokemonRepository.save(userPokemon);
        
        log.info("Pokémon evolucionado: {} (ID: {}) -> {} (ID: {})",
                evolutionInfo.getPokemonName(), evolutionInfo.getPokemonId(),
                evolutionInfo.getEvolvesToName(), evolutionInfo.getEvolvesToId());
        
        return EvolutionResultDTO.builder()
                .success(true)
                .message("¡Tu " + evolutionInfo.getPokemonName() + " ha evolucionado exitosamente a " + evolutionInfo.getEvolvesToName() + "!")
                .originalPokemonId(evolutionInfo.getPokemonId())
                .originalPokemonName(evolutionInfo.getPokemonName())
                .evolvedPokemonId(evolutionInfo.getEvolvesToId())
                .evolvedPokemonName(evolutionInfo.getEvolvesToName())
                .itemUsed(itemUsed)
                .build();
    }
    
    /**
     * Método auxiliar para extraer el nombre del Pokémon del JSON almacenado
     */
    private String extractPokemonName(Pokemon pokemon) {
        try {
            JsonNode rootNode = objectMapper.readTree(pokemon.getData());
            return rootNode.path("name").asText();
        } catch (JsonProcessingException e) {
            log.error("Error al extraer el nombre del Pokémon: {}", e.getMessage());
            return "Desconocido";
        }
    }
}