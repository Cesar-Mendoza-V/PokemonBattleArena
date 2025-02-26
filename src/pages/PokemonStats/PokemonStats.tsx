import React from 'react';
import PokemonCard from '../../components/PokemonCard/PokemonCard';

const PokemonStats: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f2f2f2'
      }}
    >
      <PokemonCard pokemonName="pikachu" />
    </div>
  );
};

export default PokemonStats;
