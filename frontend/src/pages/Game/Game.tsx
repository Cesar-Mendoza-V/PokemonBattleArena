import "./Game.css";
import poke from "/pokemon.ico";
import {
  IoPower,
  IoHomeOutline,
  IoStarOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { BsBackpack2 } from "react-icons/bs";
import GameZone1 from "../../components/GameComponents/GameZone1/GameZone1";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../api/postRequests";
import Backpack from "../../components/GameComponents/Backpack/Backpack";

type MainTab = "game" | "backpack";

const tabComponents: Record<MainTab, React.ReactNode> = {
  game: <GameZone1 />,
  backpack: <Backpack />,
};

function Game() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MainTab>("game");
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <div className="game-outside-layout">
      <aside className="game-menu-bar">
        <img src={poke} alt="Logo" className="game-menu-logo" />
        <ul className="game-menu-ul">
          <li
            className="game-menu-option"
            onClick={() => {
              setActiveTab("game");
            }}
          >
            <IoHomeOutline size={"100%"} />
          </li>
          <li
            className="game-menu-option"
            onClick={() => {
              setActiveTab("backpack");
            }}
          >
            <BsBackpack2 size={"100%"} />
          </li>
          <li className="game-menu-option">
            <IoStarOutline size={"100%"} />
          </li>
          <li className="game-menu-option">
            <IoPersonCircleOutline size={"100%"} />
          </li>
        </ul>
        <button 
          className="game-menu-signout"
          onClick={() => navigate("/signout")}
        >
          <IoPower size={"100%"} />
        </button>
      </aside>
      <div className="game-main-layout">{tabComponents[activeTab]}</div>
    </div>
  );
}

export default Game;
