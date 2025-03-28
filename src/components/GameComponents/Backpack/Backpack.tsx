import { useEffect, useState } from "react";
import "./Backpack.css";
import BackPackPokemon from "./BackpackPokemon";

const Backpack = () => {
  const [pokemonIds, setPokemonIds] = useState<number[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);

  useEffect(() => {
    const ammount = Math.ceil(Math.random() * 20);
    const newPokemonIds = [];

    for (let i = 0; i < ammount; i++) {
      newPokemonIds.push(Math.ceil(Math.random() * 151));
    }

    console.log(newPokemonIds.sort((a, b) => a - b));
    setPokemonIds(newPokemonIds);
  }, []);

  const handlePokemonClick = (id: number) => {
    setSelectedPokemon(selectedPokemon === id ? null : id);
  };

  return (
    <section className="backpack-layout">
      <h1 className="backpack-title">Mochila</h1>
      <div className="backpack-pokemons-layout">
        {pokemonIds.map((id) => (
          <div
            key={id}
            className={`backpack-pokemon-container ${
              selectedPokemon === id ? "selected" : ""
            }`}
            onClick={() => handlePokemonClick(id)}
          >
            <BackPackPokemon id={id} />
            {selectedPokemon === id && (
              <div className="pokemon-selection-buttons">
                <button className="pokemon-selection-release">
                  <img src="../../../assets/icons/release-grass.png" />
                </button>
                <button className="stats-button"></button>
                <button className="pokemon-selection-exit"></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Backpack;
