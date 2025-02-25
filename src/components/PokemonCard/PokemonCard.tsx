import React, { useEffect, useState } from 'react';
import './PokemonCard.css';

/**
 * Interface for the props of the PokemonCard component.
 * - `pokemonName`: The name of the Pokémon (e.g., "pikachu").
 */
interface PokemonCardProps {
  pokemonName: string;
}

/**
 * Interface defining the structure of Pokémon data retrieved
 * from the PokeAPI.
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
 * A color mapping based on Pokémon types to dynamically
 * assign background colors.
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
 * Functional component representing a Pokémon card.
 * Displays the Pokémon's image, type, HP, and key stats.
 */
const PokemonCard: React.FC<PokemonCardProps> = ({ pokemonName }) => {
  // State to hold the fetched Pokémon data
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  // State to manage loading state
  const [loading, setLoading] = useState<boolean>(true);
  // State to handle errors
  const [error, setError] = useState<string>('');

  useEffect(() => {
    /**
     * Fetches Pokémon data from PokeAPI based on the provided name.
     */
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

  if (loading) {
    return <div className="pokemon-card-loading">Loading...</div>;
  }

  if (error) {
    return <div className="pokemon-card-error">Error: {error}</div>;
  }

  if (!pokemonData) {
    return null;
  }

  // Get Pokémon's official artwork (fallback to default sprite if unavailable)
  const imageUrl =
    pokemonData.sprites.other?.['official-artwork']?.front_default ||
    pokemonData.sprites.front_default ||
    '';

  // Get the Pokémon's primary type (default to 'normal' if missing)
  const mainType = pokemonData.types[0]?.type.name || 'normal';
  const typeColor = typeColorMap[mainType] || '#A8A77A';

  // Extract key stats
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
      {/* Header section with a circular background for Pokémon image */}
      <div className="pokemon-card-header" style={{ backgroundColor: typeColor }}>
        {/* HP Badge in the top-right corner */}
        <div className="pokemon-hp-badge">HP {hpStat}</div>
        <img className="pokemon-image" src={imageUrl} alt={pokemonData.name} />
      </div>

      {/* Body section with Pokémon name and type */}
      <div className="pokemon-card-body">
        <h2 className="pokemon-name">{pokemonData.name}</h2>
        <div className="pokemon-type" style={{ backgroundColor: typeColor }}>
          {mainType}
        </div>
      </div>

      {/* Footer section displaying key stats */}
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
