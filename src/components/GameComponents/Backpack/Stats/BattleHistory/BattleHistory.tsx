import "./battlehistory.css";

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

// Function for showing battle history
function BattleHistory({ battles, pokemonId }: BattleHistoryProps) {
  const validBattles = battles ?? [];
  // Verify if the records is for the pokemon that are we checking
  const filteredBattles = validBattles.filter(
    (battle) => battle.pokemonId === pokemonId
  );

  return (
    <main className="battle-main-container">
      <section className="battle-history-header">
        <h4 style={{ fontWeight: "-moz-initial", fontSize: "30px" }}>
          Battle History
        </h4>
      </section>

      <section className="battle-history-records">
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
      </section>
    </main>
  );
}

export default BattleHistory;
