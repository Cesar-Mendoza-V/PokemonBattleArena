import "./Game.css";
import poke from "/pokemon.ico";
import {
  IoPower,
  IoHomeOutline,
  IoStarOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { BsBackpack2 } from "react-icons/bs";
import GameZone1 from "../../components/GameZone1/GameZone1";

function Game() {
  return (
    <div className="game-outside-layout">
      <div className="game-main-layout">
        <aside className="game-menu-bar">
          <img src={poke} alt="Logo" className="game-menu-logo" />
          <ul>
            <li className="game-menu-option">
              <IoHomeOutline size={"100%"} />
            </li>
            <li className="game-menu-option">
              <BsBackpack2 size={"100%"} />
            </li>
            <li className="game-menu-option">
              <IoStarOutline size={"100%"} />
            </li>
            <li className="game-menu-option">
              <IoPersonCircleOutline size={"100%"} />
            </li>
          </ul>
          <button className="game-menu-signout">
            <IoPower size={"100%"} />
          </button>
        </aside>
        
      </div>
    </div>
  );
}

export default Game;
