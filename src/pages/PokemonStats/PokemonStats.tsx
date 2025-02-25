import React from 'react';
import PokemonCard from '../../components/PokemonCard/PokemonCard';

const PokemonTestPage: React.FC = () => {
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
      <PokemonCard pokemonName="charizard" />
    </div>
  );
};

export default PokemonTestPage;
