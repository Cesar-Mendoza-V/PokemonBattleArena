import { useEffect, useState } from "react";
import "./Backpack.css";
import BackPackPokemon from "./BackpackPokemon";

const Backpack = () => {
  const [pokemonIds, setPokemonIds] = useState<number[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
  const [popupPokemonId, setPopupPokemonId] = useState<number | null>(null);

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

  const handlePopUpClick = (id: number) => {
    setPopupPokemonId(id);
  };

  const handleClosePopup = () => {
    setPopupPokemonId(null);
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
                <button
                  className="pokemon-selection-release"
                  onClick={() => handlePopUpClick(id)}
                >
                  <img
                    src="src/assets/images/release-grass.png"
                    alt="release"
                  />
                </button>
                <button className="stats-button"></button>
              </div>
            )}
            {popupPokemonId === id && (
              <div className="popup">
                <div className="popup-content">
                  <img src="/src/assets/gifs/pikachu-running.gif" />
                  <h2>You want to release this Pokemon?</h2>
                  <button
                    className="popup-button-release"
                    onClick={() => {
                      setPokemonIds((prev) =>
                        prev.filter((pokemonId) => pokemonId !== id)
                      );
                      handleClosePopup();
                    }}
                  >
                    RELEASE
                  </button>
                  <button className="popup-button" onClick={handleClosePopup}>
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Backpack;
