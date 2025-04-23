import "./stats.css";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const fetchPokemon = async (id: number) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

function Stats({ onClose, pokemonId }: { onClose: () => void; pokemonId: number }) {
  const { data: pokemonData, isLoading, isError } = useQuery({
    queryKey: ["pokemon", pokemonId],
    queryFn: () => fetchPokemon(pokemonId),
  });

  const [pokemonLevel] = useState(Math.floor(Math.random() * 100) + 1);

  return (
    <section className="stats-modal-page">
      <div className="stats-modal-card">
        <button className="stats-modal-close-btn" onClick={onClose}>
          X
        </button>
        <div className="stats-modal-title">
          {isLoading && <p>Cargando...</p>}
          {isError && <p>Error al cargar</p>}
          {pokemonData && (
            <p className="stats-modal-info">
              LVL {pokemonLevel} / {pokemonData.name.toUpperCase()} / #{pokemonId}
            </p>
          )}
        </div>

        <div className="stats-modal-grid">
          <div className="stats-modal-image-container">
            {pokemonData && (
              <img
                className="stats-modal-image"
                src={pokemonData.sprites.front_default}
                alt={pokemonData.name}
              />
            )}
          </div>
          <div className="stats-modal-stats-container">
            <div className="stats-modal-stats">
              <div className="stats-modal-stat">
                <p className="stats-modal-stat-label">HP</p>
                <div className="stats-modal-stat-bar"></div>
              </div>
              <div className="stats-modal-stat">
                <p className="stats-modal-stat-label">ATTACK</p>
                <div className="stats-modal-stat-bar"></div>
              </div>
              <div className="stats-modal-stat">
                <p className="stats-modal-stat-label">DEF</p>
                <div className="stats-modal-stat-bar"></div>
              </div>
              <div className="stats-modal-stat">
                <p className="stats-modal-stat-label">SP.ATK</p>
                <div className="stats-modal-stat-bar"></div>
              </div>
              <div className="stats-modal-stat">
                <p className="stats-modal-stat-label">SP.DEF</p>
                <div className="stats-modal-stat-bar"></div>
              </div>
              <div className="stats-modal-stat">
                <p className="stats-modal-stat-label">SPEED</p>
                <div className="stats-modal-stat-bar"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-modal-grid">
          <div className="stats-modal-xp">
            <div className="stats-modal-xp-item">
              <p className="stats-modal-xp-label">EXP</p>
              <div className="stats-modal-xp-bar"></div>
            </div>
            <div className="stats-modal-xp-item">
              <p className="stats-modal-xp-label">NL</p>
              <div className="stats-modal-xp-bar"></div>
            </div>
            <div>
              <p className="stats-modal-xp-label">PROGRESS</p>
            </div>
            <div className="stats-modal-progress-bar" style={{ "--wth": "40%" } as React.CSSProperties}></div>
          </div>

          <div className="stats-modal-moves">
            <div className="stats-modal-moves-list">
              <div className="stats-modal-move">
                <p className="stats-modal-type">TYPE 1</p>
                <div className="stats-modal-stat-bar"></div>
              </div>
              <div className="stats-modal-move">
                <p className="stats-modal-type">TYPE 2</p>
                <div className="stats-modal-stat-bar"></div>
              </div>
              <div className="stats-modal-move">
                <p className="stats-modal-type">TYPE 3</p>
                <div className="stats-modal-stat-bar"></div>
              </div>
              <div className="stats-modal-move">
                <p className="stats-modal-type">TYPE 4</p>
                <div className="stats-modal-stat-bar"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;