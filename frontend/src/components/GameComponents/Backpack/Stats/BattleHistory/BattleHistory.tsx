import { useEffect } from "react";
import "./BattleHistory.css";

// props of battle
interface BattleHistoryProps {
  pokemonId: number;
  battles?: {
    oponent: string;
    status: string;
    duration: string;
    pokemonId: number;
  }[];
  pokemonInfo?: {
    id: number;
    level: number;
  };
}

/* function to count the number of defeats for a given pokemon */

function countDefeats(battles: BattleHistoryProps["battles"], pokemonId: number) {
  if (!battles) return 0;

  return battles.filter(
    (battle) => battle.pokemonId === pokemonId && battle.status === "Defeat"
  ).length;
}

/* function to evaluate the battle status of a given pokemon, given level and defeats */

function evaluateBattleStatus(level: number, defeats: number) {
  if (defeats === 2) {
    if (level <= 20) {
      return "warning_low_level"; // the user will lose the pokemon
    } else {
      return "warning_high_level"; // the pokemon will lose two levels
    }
  }

  if (defeats >= 3) {
    if (level <= 20) {
      return "remove_pokemon"; // the user loses the pokemon
    } else {
      return "danger_high_level"; // the pokemon lost two levels
    }
  }

  return "ok"; // the pokemon is ok
}

/* using this function only for testing, waiting for battles */

function BattleRecordsTest() {
  // array simulating a battle record
  const testingArray = [
    {
      id: 1,
      oponent: "Pikachu",
      status: "Victory",
      duration: "10 Minutes",
      date: "2025-26-04",
    },
    {
      id: 2,
      oponent: "Magikarp",
      status: "Defeat",
      duration: "5 Minutes",
      date: "2025-04-19",
    },
    {
      id: 3,
      oponent: "Gyarados",
      status: "Defeat",
      duration: "7 Minutes",
      date: "2025-04-18",
    },
    {
      id: 4,
      oponent: "Charmander",
      status: "Defeat",
      duration: "6 Minutes",
      date: "2025-04-18",
    },
    {
      id: 5,
      oponent: "Charizard",
      status: "Victory",
      duration: "10 Minutes",
      date: "2025-04-18",
    },
    {
      id: 6,
      oponent: "Dragonite",
      status: "Defeat",
      duration: "2 Minutes",
      date: "2025-04-18",
    },
  ];

  return (
    <section className="test-record-container">
      {testingArray.map((t, index) => (
        <div key={index} className={`record-card ${t.status.toLowerCase()}`}>
          <div className="card-header">
            <p>
              <strong>Oponent</strong>
            </p>
            <p>
              <strong>Result</strong>
            </p>
            <p>
              <strong>Battle duration</strong>
            </p>
            <p>
              <strong>Battle Date</strong>
            </p>
          </div>
          <div className="card-values">
            <p>{t.oponent}</p>
            <p className={`p-status ${t.status.toLowerCase()}`}>{t.status}</p>
            <p>{t.duration}</p>
            <p>{t.date}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

/* this function will be used to show the battle history of a given pokemon */

function BattleHistory({ battles, pokemonId, pokemonInfo }: BattleHistoryProps) {
  const validBattles = battles ?? [];
  const filteredBattles = validBattles.filter(
    (battle) => battle.pokemonId === pokemonId
  );

  const defeats = countDefeats(battles, pokemonId);
  const status = evaluateBattleStatus(pokemonInfo?.level ?? 0, defeats);

  useEffect(() => {
    if (status === "warning_low_level") {
      alert("Warning! If you lose the next battle, you'll lose this pokemon permanently!");
    } else if (status === "warning_high_level") {
      alert("Warning! If you lose the next battle, this pokemon will lose two levels!");
    } else if (status === "remove_pokemon") {
      alert("You lost this pokemon!");
    } else if (status === "danger_high_level") {
      alert("Warning! This pokemon lost two levels!");
    }
  }, [status]);

  return (
    <main className="battle-main-container">
      <section className="battle-history-header">
        <h4>Battle History</h4>
      </section>

      {/*test component*/}
      <section className="battle-records-test">{<BattleRecordsTest />}</section>

      <section className="battle-history-records">
        {filteredBattles.length === 0 ? (
          <p className="no-records">No Battle History Yet!</p>
        ) : (
          filteredBattles.map((battle, index) => (
            <div key={index} className={`record-card ${battle.status.toLowerCase()}`}>
              <p>Versus: {battle.oponent}</p>
              <p>Status: {battle.status}</p>
              <p>Duration: {battle.duration}</p>
            </div>
          ))
        )}
      </section>
      
    </main>
  );
}

export default BattleHistory;
