import React, { useEffect, useState } from 'react';
import './PokemonCard.css';

/**
 * Interfaz para las props del componente.
 * - pokemonName: Nombre del Pokémon (por ejemplo: "pikachu").
 */
interface PokemonCardProps {
  pokemonName: string;
}

/**
 * Interfaz que define la estructura de los datos que obtenemos
 * de la PokeAPI para un Pokémon.
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
 * Mapeo de colores según el tipo principal del Pokémon.
 * Ajusta los colores a tu preferencia.
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

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemonName }) => {
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
        );
        if (!response.ok) {
          throw new Error('No se pudo obtener la información del Pokémon');
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
    return <div className="pokemon-card-loading">Cargando...</div>;
  }

  if (error) {
    return <div className="pokemon-card-error">Error: {error}</div>;
  }

  if (!pokemonData) {
    return null;
  }

  // Imagen (priorizando "official-artwork" si existe).
  const imageUrl =
    pokemonData.sprites.other?.['official-artwork']?.front_default ||
    pokemonData.sprites.front_default ||
    '';

  // Tomamos el primer tipo del Pokémon (si tiene más, puedes adaptarlo).
  const mainType = pokemonData.types[0]?.type.name || 'normal';
  const typeColor = typeColorMap[mainType] || '#A8A77A';

  // Obtenemos las estadísticas que queremos mostrar
  const hpStat =
    pokemonData.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0;
  const attackStat =
    pokemonData.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
  const defenseStat =
    pokemonData.stats.find(stat => stat.stat.name === 'defense')?.base_stat ||
    0;
  const speedStat =
    pokemonData.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0;

  return (
    <div className="pokemon-card-container">
      {/* Semicírculo de color (dependiendo del tipo) */}
      <div
        className="pokemon-card-header"
        style={{ backgroundColor: typeColor }}
      >
        <div className="pokemon-hp-badge">HP {hpStat}</div>
        <img className="pokemon-image" src={imageUrl} alt={pokemonData.name} />
      </div>

      {/* Cuerpo de la tarjeta con nombre y tipo */}
      <div className="pokemon-card-body">
        <h2 className="pokemon-name">{pokemonData.name}</h2>
        <div
          className="pokemon-type"
          style={{ backgroundColor: typeColor }}
        >
          {mainType}
        </div>
      </div>

      {/* Pie de la tarjeta con las estadísticas */}
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
