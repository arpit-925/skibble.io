export default function PlayerList({ players = [], drawerId }) {
  const ranked = [...players].sort((a, b) => b.score - a.score);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Players</h2>
        <span>{players.length}/20</span>
      </div>

      <div className="player-list">
        {ranked.map((player, index) => (
          <div key={player.id} className={`player-row ${player.id === drawerId ? "drawing" : ""}`}>
            <div>
              <strong>{index + 1}. {player.name}</strong>
              <small>
                {player.isHost ? "Host" : "Player"}
                {player.id === drawerId ? " drawing" : ""}
                {player.hasGuessed ? " guessed" : ""}
              </small>
            </div>
            <span>{player.score}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
