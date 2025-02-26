import { useEffect, useRef, useState } from "react";
import "./Game.css";

import poke from "/pokemon.ico";
import {
  FaArrowDown,
  FaArrowUp,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";

import {
  IoPower,
  IoHomeOutline,
  IoStatsChartOutline,
  IoStarOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import GridPokemon from "../../components/GridPokemon/GridPokemon";

interface SpawnArea {
  startX: number; // inclusive --> | [...]
  startY: number; // inclusive --> | [...]
  endX: number; // exclusive [...] --> |
  endY: number; // exclusive [...] --> |
}

const spawnAreas: SpawnArea[] = [
  { startX: 2, startY: 9, endX: 12, endY: 12 },
  { startX: 19, startY: 17, endX: 24, endY: 23 },
  { startX: 3, startY: 13, endX: 7, endY: 26 },
  { startX: 12, startY: 11, endX: 16, endY: 19 },
];

interface SpawnedPokemon {
  id: number;
  x: number;
  y: number;
}

function Game() {
  const [spawnedPokemon, setSpawnedPokemon] = useState<SpawnedPokemon[]>([]);

  const currentPokemon = useRef<Set<number>>(new Set());

  const [selectedPokemon, setSelectedPokemon] = useState<SpawnedPokemon | null>(
    null
  );

  useEffect(() => {
    spawnAreas.forEach((area) => {
      if (Math.random() > 0.5) {
        const startX = Math.floor(
          Math.random() * (area.endX - 1 - area.startX) + area.startX
        );
        const startY = Math.floor(
          Math.random() * (area.endY - 1 - area.startY) + area.startY
        );

        var pokemonID = 0;

        while (pokemonID == 0 || currentPokemon.current.has(pokemonID)) {
          // Math.random() * (max-exclusive - min-inclusive) + min-inclusive;
          pokemonID = Math.floor(Math.random() * (152 - 1) + 1);
        }

        currentPokemon.current.add(pokemonID);

        setSpawnedPokemon((prev) => [
          ...prev,
          { id: pokemonID, x: startX, y: startY },
        ]);
      }
    });
  }, []);

  return (
    <div className="game-outside-layout">
      <div className="game-main-layout">
        <aside className="game-menu-bar">
          <img src={poke} alt="Logo" className="game-menu-logo" />
          <ul>
            <li className="game-menu-option">
              <IoHomeOutline size={"full"} />
            </li>
            <li className="game-menu-option">
              <IoStatsChartOutline size={"full"} />
            </li>
            <li className="game-menu-option">
              <IoStarOutline size={"full"} />
            </li>
            <li className="game-menu-option">
              <IoPersonCircleOutline size={"full"} />
            </li>
          </ul>
          <button className="game-menu-signout">
            <IoPower size={"full"} />
          </button>
        </aside>
        <main className="game-content">
          <div
            onClick={() => {
              setSelectedPokemon(null);
            }}
            className="game-grid"
          >
            {spawnedPokemon.length == 0 && (
              <div className="game-content-message">
                No hay Pokémon en esta zona
              </div>
            )}
            {spawnedPokemon.map((pokemon) => (
              <GridPokemon
                key={"pokemon_" + pokemon.id}
                pokemon={pokemon}
                setSelectedPokemon={setSelectedPokemon}
                selected={selectedPokemon == pokemon}
              />
            ))}
          </div>
        </main>
        <aside className="game-buttons-bar">
          <div className="game-controls-buttons-div">
            <button
              className="game-controls-button"
              disabled={selectedPokemon == null}
              onClick={() => {
                // TODO
                // Extraer componente y agregar funcionalidad
                console.log(`Pokemon ${selectedPokemon?.id} capturado.`);
              }}
            >
              Capturar
            </button>
            <button
              className="game-controls-button"
              disabled={selectedPokemon == null}
              onClick={() => {
                // TODO
                // Extraer componente y agregar funcionalidad
                console.log(`Informacion del Pokemon ${selectedPokemon?.id}.`);
              }}
            >
              Información
            </button>
            <button
              className="game-controls-button"
              disabled={selectedPokemon == null}
              onClick={() => {
                // TODO
                // Extraer componente y agregar funcionalidad
                console.log(`Huiste del Pokemon ${selectedPokemon?.id}.`);
              }}
            >
              Huir
            </button>
            <button className="game-controls-button">Mochila</button>
          </div>
          <div className="game-controls-gamepad">
            <button className="up">
              <FaArrowUp size={"full"} />
            </button>
            <button className="left">
              <FaArrowLeft size={"full"} />
            </button>
            <button className="right">
              <FaArrowRight size={"full"} />
            </button>
            <button className="down">
              <FaArrowDown size={"full"} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Game;
