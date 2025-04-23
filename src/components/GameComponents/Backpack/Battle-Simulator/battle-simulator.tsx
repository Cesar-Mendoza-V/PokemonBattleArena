import React, { useState } from "react";
import "./battle-simulator.css";
import BackPackPokemon from "../BackpackPokemon";

interface BattleSimulatorProps {
  pokemonId: number;
  onClose: () => void;
  pokemonList: number[];
}

const BattleSimulator: React.FC<BattleSimulatorProps> = ({ onClose, pokemonList }) => {
  const [selected, setSelected] = useState<number[]>([]);

  const handleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(p => p !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
  };

  const handleSlotClick = (id: number) => {
    // If the Pokémon is selected, remove it from the selection
    setSelected(selected.filter(p => p !== id));
  };

  return (
    <div className="battle-simulator-container">
      <div className="battleS-header">
        <h2>SELECT YOUR POKEMON</h2>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>

      <div className="battle-content">
        <div className="pokemon-selection-area">
          {pokemonList.map((id) => (
            <div
              key={id}
              className={`pokemon-option ${selected.includes(id) ? "selected" : ""}`}
              onClick={() => handleSelect(id)}
            >
              <BackPackPokemon id={id} customClass="popup-pokemon-card" />
            </div>
          ))}
        </div>

        <div className="battle-vs-area">
          <div className="pokemon-slot" onClick={() => selected[0] && handleSlotClick(selected[0])}>
            {selected[0] && <BackPackPokemon id={selected[0]} customClass="popup-pokemon-card" />}
          </div>
          <div className="vs-text">VS</div>
          <div className="pokemon-slot" onClick={() => selected[1] && handleSlotClick(selected[1])}>
            {selected[1] && <BackPackPokemon id={selected[1]} customClass="popup-pokemon-card" />}
          </div>
        </div>
      </div>

      <div className="fight-button-container">
        <button className="fight-button" disabled={selected.length !== 2}>
          FIGHT
        </button>
      </div>
    </div>
  );
};

export default BattleSimulator;
