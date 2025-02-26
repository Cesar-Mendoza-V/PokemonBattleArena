import React, { useEffect, useState } from 'react';
import './PokemonCard.css';

/**
 * Props for the PokemonCard component.
 * - pokemonName: The name of the Pokémon (e.g., "charmander").
 */
interface PokemonCardProps {
  pokemonName: string;
}

/**
 * Interface for the Pokémon data fetched from PokeAPI.
 */
interface PokemonData {
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      }
    }
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
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

/**
 * The PokemonCard component displays a Pokémon's image, types, HP, key stats, and now also its level.
 * The level is determined by fetching encounter data from the PokeAPI, randomly selecting an encounter area,
 * and then generating a random level between the min and max level defined for that area.
 */
const PokemonCard: React.FC<PokemonCardProps> = ({ pokemonName }) => {
  // State to store Pokémon data from the main endpoint
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  // State to store the generated Pokémon level
  const [pokemonLevel, setPokemonLevel] = useState<number | null>(null);
  // Loading state for the main data
  const [loading, setLoading] = useState<boolean>(true);
  // Error state for the main data
  const [error, setError] = useState<string>('');

  // Fetch Pokémon data (image, types, stats, etc.)
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch Pokémon data');
        }
        const data: PokemonData = await response.json();
        setPokemonData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonName]);

  // Fetch encounter data to determine the Pokémon's level based on a random area.
  // Fetch encounter data to determine the Pokémon's level based on a random area.
useEffect(() => {
    const fetchEncounters = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}/encounters`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch encounter data');
        }
        const encounterData = await response.json();
        if (encounterData.length > 0) {
          // Randomly select an encounter area from the returned array
          const randomEncounter =
            encounterData[Math.floor(Math.random() * encounterData.length)];
          // Check if version_details exist
          if (
            randomEncounter.version_details &&
            randomEncounter.version_details.length > 0
          ) {
            // Randomly select a version detail
            const randomVersion =
              randomEncounter.version_details[
                Math.floor(Math.random() * randomEncounter.version_details.length)
              ];
            // Make sure encounter_details array exists and has at least one element
            if (
              randomVersion.encounter_details &&
              randomVersion.encounter_details.length > 0
            ) {
              // Access the first element in encounter_details
              const encounterDetail = randomVersion.encounter_details[0];
              const minLevel = encounterDetail.min_level;
              const maxLevel = encounterDetail.max_level;
              // Generate a random level between min and max (inclusive)
              const level =
                Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
              setPokemonLevel(level);
            } else {
              // Fallback if encounter_details is missing or empty
              setPokemonLevel(5);
            }
          } else {
            // Fallback default level if no version_details are available
            setPokemonLevel(5);
          }
        } else {
          // Fallback default level if no encounter data is available
          setPokemonLevel(5);
        }
      } catch (error: any) {
        console.error('Error fetching encounters:', error);
        setPokemonLevel(5); // Fallback default level on error
      }
    };
  
    fetchEncounters();
  }, [pokemonName]);
  

  if (loading) {
    return <div className="pokemon-card-loading">Loading...</div>;
  }

  if (error) {
    return <div className="pokemon-card-error">Error: {error}</div>;
  }

  if (!pokemonData) {
    return null;
  }

  // Get Pokémon image (preferring official artwork)
  const imageUrl =
    pokemonData.sprites.other?.['official-artwork']?.front_default ||
    pokemonData.sprites.front_default ||
    '';

  // Extract Pokémon types as an array of strings
  const typesArray = pokemonData.types.map(typeObj => typeObj.type.name);

  // Set header background: use gradient if two types; otherwise, a solid color.
  let headerStyle = {};
  if (typesArray.length === 2) {
    const color1 = typeColorMap[typesArray[0]] || '#A8A77A';
    const color2 = typeColorMap[typesArray[1]] || '#A8A77A';
    headerStyle = { background: `linear-gradient(90deg, ${color1}, ${color2})` };
  } else {
    const color = typeColorMap[typesArray[0]] || '#A8A77A';
    headerStyle = { backgroundColor: color };
  }

  // Extract key stats from the Pokémon data
  const hpStat =
    pokemonData.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0;
  const attackStat =
    pokemonData.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
  const defenseStat =
    pokemonData.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0;
  const speedStat =
    pokemonData.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0;

  return (
    <div className="pokemon-card-container">
      {/* Header: displays the Pokémon image and an HP badge; background is set based on type(s) */}
      <div className="pokemon-card-header" style={headerStyle}>
        <div className="pokemon-hp-badge">HP {hpStat}</div>
        <img className="pokemon-image" src={imageUrl} alt={pokemonData.name} />
      </div>

      {/* Body: shows the generated level, Pokémon name, and type badges */}
      <div className="pokemon-card-body">
        {/* Display the generated level */}
        <div className="pokemon-level-display">
          Level: {pokemonLevel !== null ? pokemonLevel : 'N/A'}
        </div>
        <h2 className="pokemon-name">{pokemonData.name}</h2>
        <div className="pokemon-types">
          {typesArray.map((type, index) => (
            <div
              key={index}
              className="pokemon-type-badge"
              style={{ backgroundColor: typeColorMap[type] || '#A8A77A' }}
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
