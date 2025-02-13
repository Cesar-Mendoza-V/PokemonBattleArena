import "./Home.css";

import poke from "/pokemon.png";

import {
  IoPower,
  IoHomeOutline,
  IoStatsChartOutline,
  IoStarOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";

function Home() {
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
        <main className="game-content"></main>
        <aside className="game-buttons-bar">sidebar</aside>
      </div>
    </div>
  );
}

export default Home;
