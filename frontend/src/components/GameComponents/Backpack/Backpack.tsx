import { useEffect, useState } from "react";
import "./Backpack.css";
import BackPackPokemon from "./BackpackPokemon";
import Stats from "./Stats/stats";
import "./Stats/stats.css";

const Backpack = () => {
  const [pokemonIds, setPokemonIds] = useState<number[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
  const [popupPokemonId, setPopupPokemonId] = useState<number | null>(null);
  const [statsPopupId, setStatsPopupId] = useState<number | null>(null);

  useEffect(() => {
    const ammount = Math.ceil(Math.random() * 20);
    const newPokemonIds = [];

    for (let i = 0; i < ammount; i++) {
      newPokemonIds.push(Math.ceil(Math.random() * 151));
    }

    setPokemonIds(newPokemonIds);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (popupPokemonId !== null) {
          handleClosePopup();
        }
        if (statsPopupId !== null) {
          handleCloseStatsPopup();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [popupPokemonId, statsPopupId]);

  const handlePokemonClick = (id: number) => {
    setSelectedPokemon(selectedPokemon === id ? null : id);
  };

  const handlePopUpClick = (id: number) => {
    setPopupPokemonId(id);
  };

  const handleClosePopup = () => {
    setPopupPokemonId(null);
  };

  const handleStatsClick = (id: number) => {
    setStatsPopupId(id);
  };

  const handleCloseStatsPopup = () => {
    setStatsPopupId(null);
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
                  <img src="src/assets/gifs/animatedGrass.gif" alt="release" />
                </button>
                <button
                  className="stats-button"
                  onClick={() => handleStatsClick(id)}
                >
                  <img
                    src="src/assets/images/statcom.png"
                    alt="stats"
                    style={{
                      borderRadius: "20px",
                      backgroundColor: "rgb(255, 255, 255, 0.2)",
                      boxShadow: "0px 0px 3px 4pxrgb(224, 224, 224)",
                    }}
                  ></img>
                </button>
              </div>
            )}
            {popupPokemonId === id && (
              <div className="popup">
                <div className="popup-content">
                  <img
                    src="/src/assets/gifs/pikachu-running.gif"
                    alt="pokemon running"
                  />
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
            {statsPopupId === id && (
              <div className="popup">
                <div>
                  <Stats onClose={handleCloseStatsPopup} pokemonId={id} />
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
