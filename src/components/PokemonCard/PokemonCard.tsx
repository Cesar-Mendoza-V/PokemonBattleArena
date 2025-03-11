import React from "react";
import { useQuery } from "@tanstack/react-query";
import "./PokemonCard.css";

/**
 * Props for the PokemonCard component.
 * - pokemonId: The numeric ID of the Pokémon.
 */
interface PokemonCardProps {
  pokemonId: number;
}

/**
 * Interface for the Pokémon data fetched from PokeAPI.
 */
interface PokemonData {
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}

/**
 * Mapping of Pokémon types to colors.
 */
const typeColorMap: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemonId }) => {
  // Fetch main Pokemon data
  const {
    data: pokemonData,
    isLoading: isLoadingPokemon,
    isError: isErrorPokemon,
    error: errorPokemon,
  } = useQuery<PokemonData>({
    queryKey: ["pokemon", pokemonId],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      if (!response.ok) throw new Error("Failed to fetch Pokémon data");
      return response.json();
    },
    staleTime: Infinity, // Cache the data indefinitely
  });

  // Fetch Pokemon encounter data to determine level
  const {
    data: pokemonLevel,
    isLoading: isLoadingLevel,
    isError: isErrorLevel,
    error: errorLevel,
  } = useQuery<number>({
    queryKey: ["pokemonEncounter", pokemonId],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`
      );
      if (!response.ok) throw new Error("Failed to fetch encounter data");
      const encounterData = await response.json();

      // Determine level from encounter data, if available
      if (encounterData.length > 0) {
        const randomEncounter =
          encounterData[Math.floor(Math.random() * encounterData.length)];
        if (
          randomEncounter.version_details &&
          randomEncounter.version_details.length > 0
        ) {
          const randomVersion =
            randomEncounter.version_details[
              Math.floor(Math.random() * randomEncounter.version_details.length)
            ];
          if (
            randomVersion.encounter_details &&
            randomVersion.encounter_details.length > 0
          ) {
            const encounterDetail = randomVersion.encounter_details[0];
            const minLevel = encounterDetail.min_level;
            const maxLevel = encounterDetail.max_level;
            const level =
              Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
            return level;
          }
        }
      }
      return 5; // Default level if no encounter data is available
    },
    staleTime: Infinity, // Cache the data indefinitely
  });

  // Display loading state
  if (isLoadingPokemon || isLoadingLevel) {
    return <div className="pokemon-card-loading">Loading...</div>;
  }

  // Display error state
  if (isErrorPokemon || isErrorLevel) {
    return (
      <div className="pokemon-card-error">
        Error:{" "}
        {(errorPokemon as Error)?.message || (errorLevel as Error)?.message}
      </div>
    );
  }

  if (!pokemonData) {
    return null;
  }

  // Get Pokémon image (preferring official artwork)
  const imageUrl =
    pokemonData.sprites.other?.["official-artwork"]?.front_default ||
    pokemonData.sprites.front_default ||
    "";

  // Extract Pokémon types as an array of strings
  const typesArray = pokemonData.types.map((typeObj) => typeObj.type.name);

  // Set header background: use gradient if two types; otherwise, a solid color.
  let headerStyle = {};
  if (typesArray.length === 2) {
    const color1 = typeColorMap[typesArray[0]] || "#A8A77A";
    const color2 = typeColorMap[typesArray[1]] || "#A8A77A";
    headerStyle = {
      background: `linear-gradient(90deg, ${color1}, ${color2})`,
    };
  } else {
    const color = typeColorMap[typesArray[0]] || "#A8A77A";
    headerStyle = { backgroundColor: color };
  }

  // Extract key stats from the Pokémon data
  const hpStat =
    pokemonData.stats.find((stat) => stat.stat.name === "hp")?.base_stat || 0;
  const attackStat =
    pokemonData.stats.find((stat) => stat.stat.name === "attack")?.base_stat ||
    0;
  const defenseStat =
    pokemonData.stats.find((stat) => stat.stat.name === "defense")?.base_stat ||
    0;
  const speedStat =
    pokemonData.stats.find((stat) => stat.stat.name === "speed")?.base_stat ||
    0;

  return (
    <div className="pokemon-card-container">
      {/* Header: displays the Pokémon image and an HP badge; background is set based on type(s) */}
      <div className="pokemon-card-header" style={headerStyle}>
        <div className="pokemon-hp-badge">HP {hpStat}</div>
        <img className="pokemon-image" src={imageUrl} alt={pokemonData.name} />
      </div>

      {/* Body: shows the generated level, Pokémon name, and type badges */}
      <div className="pokemon-card-body">
        <div className="pokemon-level-display">
          Level: {pokemonLevel !== null ? pokemonLevel : "N/A"}
        </div>
        <h2 className="pokemon-name">{pokemonData.name}</h2>
        <div className="pokemon-types">
          {typesArray.map((type, index) => (
            <div
              key={index}
              className="pokemon-type-badge"
              style={{ backgroundColor: typeColorMap[type] || "#A8A77A" }}
            >
              {type}
            </div>
          ))}
        </div>
      </div>

      {/* Footer: displays key stats (Attack, Defense, Speed) */}
      <div className="pokemon-card-footer">
        <div className="pokemon-stat">
          <p className="stat-value">{attackStat}</p>
          <p className="stat-label">Attack</p>
        </div>
        <div className="pokemon-stat">
          <p className="stat-value">{defenseStat}</p>
          <p className="stat-label">Defense</p>
        </div>
        <div className="pokemon-stat">
          <p className="stat-value">{speedStat}</p>
          <p className="stat-label">Speed</p>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
