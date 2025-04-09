import React from "react";
import "./battle-simulator.css";
import BackPackPokemon from "../BackpackPokemon";

interface BattleSimulatorProps {
  pokemonId: number;
  onClose: () => void;
  pokemonList: number[];
}

const BattleSimulator: React.FC<BattleSimulatorProps> = ({ onClose, pokemonList }) => {
  return (
    <div className="battle-simulator-container">
      <div className="battleS-header">
        <h2>SELECT YOUR POKEMON</h2>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>

      <div className="battle-content">
        <div className="pokemon-selection-area">
          {pokemonList.map((id) => (
            <div key={id} className="pokemon-option">
                <BackPackPokemon id={id} customClass="popup-pokemon-card" />
            </div>
          ))}
        </div>

        <div className="battle-vs-area">
          <div className="pokemon-slot"></div>
          <div className="vs-text">VS</div>
          <div className="pokemon-slot"></div>
        </div>
      </div>

      <div className="fight-button-container">
        <button className="fight-button">FIGHT</button>
      </div>
    </div>
  );
};

export default BattleSimulator;
