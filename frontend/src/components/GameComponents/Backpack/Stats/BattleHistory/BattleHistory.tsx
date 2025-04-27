import "./BattleHistory.css";

// Props of battle
interface BattleHistoryProps {
  pokemonId: number;
  battles?: {
    oponent: string;
    status: string;
    duration: string;
    pokemonId: number;
  }[];
}

/*
Using this function only for testing, waiting for battles
*/
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

// Function for showing battle history
function BattleHistory({ battles, pokemonId }: BattleHistoryProps) {
  // When battles implemented we receive the data of the
  const validBattles = battles ?? [];
  // Verify if the records is for the pokemon that are we checking
  const filteredBattles = validBattles.filter(
    (battle) => battle.pokemonId === pokemonId
  );

  return (
    <main className="battle-main-container">
      <section className="battle-history-header">
        <h4>Battle History</h4>
      </section>

      <section className="battle-records-test">{<BattleRecordsTest />}</section>

      {/*<section className="battle-history-records">
        {filteredBattles.length === 0 ? (
          <p className="no-records">No Battle History Yet!</p>
        ) : (
          filteredBattles.map((battle, index) => (
            <div key={index} className="record-card">
              <p>Versus: {battle.oponent}</p>
              <p>Status: {battle.status}</p>
              <p>Duration: {battle.duration}</p>
            </div>
          ))
        )}
      </section>*/}
    </main>
  );
}

export default BattleHistory;
