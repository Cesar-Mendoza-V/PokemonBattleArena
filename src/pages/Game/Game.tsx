import './Game.css';
import { useState } from 'react';

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

function Home() {
  const [isPopupVisible, setPopupVisible] = useState(false); 

  const handleLogoutClick = () => {
    setPopupVisible(true); 
  };

  const handleCancelClick = () => {
    setPopupVisible(false); 
  };

  const handleConfirmLogout = () => {
    setPopupVisible(false); 
    console.log('Cerrar sesión');
  };

  return (
    <div className="game-outside-layout">
      <div className="game-main-layout">
        <aside className="game-menu-bar">
          <img src="/pokemon.ico"  alt="Logo" className="game-menu-logo" />
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
          <button className="game-menu-signout" onClick={handleLogoutClick}>
            <IoPower size={"full"} />
          </button>
        </aside>
        <main className="game-content"></main>
        <aside className="game-buttons-bar">
          <div className="game-controls-buttons-div">
            <button className="game-controls-button">Combatir</button>
            <button className="game-controls-button">Mochila</button>
            <button className="game-controls-button">Pokemon</button>
            <button className="game-controls-button">Huir</button>
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
      
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>¿Quieres cerrar sesión?</p>
            <div className="popup-buttons">
              <button className="popup-button-cancel" onClick={handleCancelClick}>No</button>
              <button className="popup-button-confirm" onClick={handleConfirmLogout}>Sí</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
