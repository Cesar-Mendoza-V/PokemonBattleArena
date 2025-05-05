import { useState, useEffect, useRef } from "react";
import "./Battle.css";

interface PokemonData {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
}

interface BattleProps {
  playerPokemon: PokemonData;
  enemyPokemon: PokemonData;
  onBattleEnd: () => void;
}

const Battle = ({ playerPokemon, enemyPokemon, onBattleEnd }: BattleProps) => {
  const [playerHP, setPlayerHP] = useState(playerPokemon.hp);
  const [enemyHP, setEnemyHP] = useState(enemyPokemon.hp);
  const [playerSprite, setPlayerSprite] = useState<string>("");
  const [playerFrontSprite, setPlayerFrontSprite] = useState<string>("");
  const [enemySprite, setEnemySprite] = useState<string>("");
  const [realEnemyName, setRealEnemyName] = useState<string>("");
  const [realPlayerName, setRealPlayerName] = useState<string>("");
  const [playerMoves, setPlayerMoves] = useState<string[]>([]);
  const [dialogue, setDialogue] = useState<string>("¡Empieza la batalla!");

  const playerSpriteRef = useRef<HTMLImageElement>(null); 

  useEffect(() => {
    const fetchSpritesAndMoves = async () => {
      try {
        const getApiName = (rawName: string): string => {
          if (rawName.toLowerCase().startsWith("pokemon#")) {
            return rawName.split("#")[1];
          }
          return rawName.toLowerCase();
        };

        const playerQuery = getApiName(playerPokemon.name);
        const enemyQuery = getApiName(enemyPokemon.name);

        const playerResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${playerQuery}`);
        const playerData = await playerResponse.json();
        setPlayerSprite(playerData.sprites.back_default);
        setPlayerFrontSprite(playerData.sprites.front_default);
        setRealPlayerName(playerData.name);

        const enemyResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${enemyQuery}`);
        const enemyData = await enemyResponse.json();
        setEnemySprite(enemyData.sprites.front_default);
        setRealEnemyName(enemyData.name);

        let moves = playerData.moves.slice(0, 4).map((m: any) => m.move.name);
        if (!moves.includes("mega-punch")) {
          moves[0] = "mega-punch";
        }

        setPlayerMoves(moves);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchSpritesAndMoves();
  }, [playerPokemon.name, enemyPokemon.name]);

  const getDamageForMove = (moveName: string): number => {
    switch (moveName.toLowerCase()) {
      case "mega-punch":
        return Math.floor(Math.random() * 15) + 20;
      case "tackle":
        return Math.floor(Math.random() * 5) + 5;
      case "surf":
        return Math.floor(Math.random() * 7) + 10;
      case "scary-face":
        return Math.floor(Math.random() * 4) + 2;
      default:
        return Math.floor(Math.random() * 6) + 5;
    }
  };

  const attack = (target: "enemy" | "player", moveName: string) => {
    const damage = getDamageForMove(moveName);
    let attackMessage = "";

    // ANIMACIÓN si el jugador ataca
    if (target === "enemy" && playerSpriteRef.current) {
      const sprite = playerSpriteRef.current;
      sprite.classList.add("attack-animation");
      setTimeout(() => sprite.classList.remove("attack-animation"), 400);
    }

    if (target === "enemy") {
      setEnemyHP((prev) => Math.max(0, prev - damage));
      switch (moveName.toLowerCase()) {
        case "mega-punch":
          attackMessage = `¡${capitalize(realPlayerName)} usó Mega-puño! ¡Es un golpe devastador!`;
          break;
        case "tackle":
          attackMessage = `¡${capitalize(realPlayerName)} usó Tackle! ¡El enemigo recibe daño!`;
          break;
        case "surf":
          attackMessage = `¡${capitalize(realPlayerName)} usó Surf! ¡Una ola arrasadora!`;
          break;
        case "scary-face":
          attackMessage = `¡${capitalize(realPlayerName)} usó Cara Aterradora! ¡El enemigo está asustado!`;
          break;
        default:
          attackMessage = `¡${capitalize(realPlayerName)} usó ${capitalize(moveName)}! ¡Es un ataque fuerte!`;
      }
    } else {
      setPlayerHP((prev) => Math.max(0, prev - damage));
      attackMessage = `¡${capitalize(realEnemyName)} usó ${capitalize(moveName)}! ¡El ataque del enemigo es fuerte!`;
    }

    setDialogue(attackMessage);
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (enemyHP <= 0) {
    return (
      <div className="battle-screen">
        <h2 className="victory-text">¡Has ganado la batalla!</h2>
        <img
          src={playerFrontSprite}
          alt={realPlayerName}
          className="pokemon-sprite winner-sprite large"
        />
        <h3 className="pokemon-name winner">{capitalize(realPlayerName)}</h3>
        <button className="battle-button winner" onClick={onBattleEnd}>Regresar</button>
      </div>
    );
  }
  

  if (playerHP <= 0) {
    return (
      <div className="battle-screen">
        <h2 className="defeat-text">Has sido derrotado...</h2>
        <button className="battle-button" onClick={onBattleEnd}>Regresar</button>
      </div>
    );
  }

  return (
    <div className="battle-screen">
      <img src={enemySprite} alt={realEnemyName} className="pokemon-sprite enemy-sprite" />
      <img
        src={playerSprite}
        alt={realPlayerName}
        className="pokemon-sprite player-sprite"
        ref={playerSpriteRef} 
      />

      <div className="battle-enemy">
        <div className="battle-info">
          <div className="pokemon-title">{capitalize(realEnemyName)} Lv.{enemyPokemon.level} 🔴</div>
          <div className="hp-bar">
            <div className="hp" style={{ width: `${(enemyHP / enemyPokemon.maxHp) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="battle-player">
        <div className="battle-info">
          <div className="pokemon-title">{capitalize(realPlayerName)} Lv.{playerPokemon.level} 🔴</div>
          <div className="hp-bar">
            <div className="hp" style={{ width: `${(playerHP / playerPokemon.maxHp) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="battle-actions">
        {playerMoves.map((move, index) => (
          <button key={index} className="battle-button" onClick={() => attack("enemy", move)}>
            {move.replace(/-/g, " ")}
          </button>
        ))}
      </div>

      <div className="battle-dialogue">
        <p>{dialogue}</p>
      </div>
    </div>
  );
};

export default Battle;
