import { useEffect, useState } from "react";
import "./Backpack.css";
import BackPackPokemon from "./BackpackPokemon";

const MAX_TEAM_SIZE = 6;
const MAX_POKEMON = 151;

const generatePokemonIds = (amount: number) => {
  return Array.from(new Set(Array.from({ length: amount }, () => Math.ceil(Math.random() * MAX_POKEMON)))).sort((a, b) => a - b);
};

const Backpack = () => {
  const [pokemonIds, setPokemonIds] = useState<number[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setPokemonIds(generatePokemonIds(Math.ceil(Math.random() * 20)));
  }, []);

  const toggleSelection = (id: number) => {
    setSelectedPokemon((prev) => {
      if (prev.includes(id)) return prev.filter((pid) => pid !== id);
      if (prev.length >= MAX_TEAM_SIZE) {
        setIsModalOpen(true);
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <section className="backpack-layout">
      <h1 className="backpack-title">🎒 Mochila Pokémon</h1>

      <div className="backpack-pokemons-layout">
        {pokemonIds.map((id, index) => (
          <div key={id} className="pokemon-selection" style={{ animationDelay: `${index * 0.1}s` }}>
            <input
              type="checkbox"
              checked={selectedPokemon.includes(id)}
              onChange={() => toggleSelection(id)}
              className="poke-checkbox"
            />
            <BackPackPokemon id={id} />
            <p className="pokemon-id-text"># {id}</p>
          </div>
        ))}
      </div>

      <div className="team-container">
  <h2 className="team-title">🧢 Tu Equipo ({selectedPokemon.length}/{MAX_TEAM_SIZE})</h2>
  <ul className="team-list">
    {selectedPokemon.map((id) => (
      <li key={id} className="team-item"> 🔴 Pokémon #{id}</li>
    ))}
  </ul>
</div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">¡No puedes escoger más de {MAX_TEAM_SIZE} pokémon en tu equipo!</h2>
            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Backpack;
