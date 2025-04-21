import { useEffect, useRef, useState } from "react";
import GridPokemon from "../GridPokemon/GridPokemon";
import "./GameZone.css";

import Modal from "../../Modal/Modal";
import PokemonCard from "../../PokemonCard/PokemonCard";
import Battle from "../Battle/Battle";

import { FaArrowDown, FaArrowUp, FaArrowRight, FaArrowLeft } from "react-icons/fa";

interface SpawnArea {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const spawnAreas: SpawnArea[] = [
  { startX: 2, startY: 9, endX: 12, endY: 12 },
  { startX: 19, startY: 17, endX: 24, endY: 23 },
  { startX: 3, startY: 13, endX: 7, endY: 26 },
  { startX: 12, startY: 11, endX: 16, endY: 19 }
];

interface SpawnedPokemon {
  id: number;
  x: number;
  y: number;
  shiny: boolean;
}

const GameZone1 = () => {
  const [spawnedPokemon, setSpawnedPokemon] = useState<SpawnedPokemon[]>([]);
  const currentPokemon = useRef<Set<number>>(new Set());
  const [selectedPokemon, setSelectedPokemon] = useState<SpawnedPokemon | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isBattling, setIsBattling] = useState(false);
  const [battleDialog, setBattleDialog] = useState<string>("");

  useEffect(() => {
    spawnAreas.forEach((area) => {
      if (Math.random() > 0.5) {
        const startX = Math.floor(Math.random() * (area.endX - 1 - area.startX) + area.startX);
        const startY = Math.floor(Math.random() * (area.endY - 1 - area.startY) + area.startY);
        let pokemonID = 0;
        while (pokemonID == 0 || currentPokemon.current.has(pokemonID)) {
          pokemonID = Math.floor(Math.random() * (152 - 1) + 1);
        }
        currentPokemon.current.add(pokemonID);
        const is_shiny = Math.floor(Math.random() * (100 - 1) + 1) == 2;
        setSpawnedPokemon((prev) => [
          ...prev,
          { id: pokemonID, x: startX, y: startY, shiny: is_shiny }
        ]);
      }
    });
  }, []);

  if (isBattling && selectedPokemon) {
    return (
      <Battle
        playerPokemon={{ name: "Pikachu", hp: 80, maxHp: 80, level: 20 }}
        enemyPokemon={{ name: `Pokemon#${selectedPokemon.id}`, hp: 60, maxHp: 60, level: 12 }}
        onBattleEnd={() => {
          setIsBattling(false);
          setSelectedPokemon(null);
          setBattleDialog("¡La batalla ha terminado!");
        }}
      />
    );
  }

  return (
    <>
      <main className="game-content">
        <div
          onClick={() => {
            setSelectedPokemon(null);
            setShowInfoModal(true);
          }}
          className="game-grid"
        >
          {spawnedPokemon.length == 0 && (
            <div className="game-content-message">No hay Pokémon en esta zona</div>
          )}
          {spawnedPokemon.map((pokemon) => (
            <GridPokemon
              key={"pokemon_" + pokemon.id}
              pokemon={pokemon}
              setSelectedPokemon={setSelectedPokemon}
              selected={selectedPokemon === pokemon}
            />
          ))}
        </div>
      </main>

      <aside className="game-buttons-bar">
        <div className="game-controls-buttons-div">
          <button
            className="game-controls-button"
            disabled={selectedPokemon == null}
            onClick={() => setBattleDialog(`¡Capturaste a Pokémon ${selectedPokemon?.id}!`)}
          >
            Capturar
          </button>
          <button
            className="game-controls-button"
            disabled={selectedPokemon == null}
            onClick={() => setShowInfoModal(true)}
          >
            Información
          </button>
          <button
            className="game-controls-button"
            disabled={selectedPokemon == null}
            onClick={() => setBattleDialog(`¡Huiste de Pokémon ${selectedPokemon?.id}!`)}
          >
            Huir
          </button>
          <button
            className="game-controls-button"
            disabled={selectedPokemon == null}
            onClick={() => {
              setIsBattling(true);
              setBattleDialog(`¡Una batalla contra Pokémon ${selectedPokemon?.id} ha comenzado!`);
            }}
          >
            Batalla
          </button>
          <button
            className="game-controls-button"
            onClick={() => setBattleDialog("Abriendo la mochila...")}
          >
            Mochila
          </button>
        </div>

        <div className="game-controls-gamepad">
          <button className="up"><FaArrowUp size="100%" /></button>
          <button className="left"><FaArrowLeft size="100%" /></button>
          <button className="right"><FaArrowRight size="100%" /></button>
          <button className="down"><FaArrowDown size="100%" /></button>
        </div>

        {battleDialog && (
          <div className="game-dialog-box">
            <p>{battleDialog}</p>
          </div>
        )}
      </aside>

      {showInfoModal && selectedPokemon && (
        <Modal onClose={() => setShowInfoModal(false)}>
          <PokemonCard pokemonId={selectedPokemon.id} />
        </Modal>
      )}
    </>
  );
};

export default GameZone1;

