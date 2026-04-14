export default function Scoreboard({ players = [], winner }) {
  const ranked = [...players].sort((a, b) => b.score - a.score);

  return (
    <section className="panel scoreboard">
      <div className="panel-header">
        <h2>Leaderboard</h2>
        {winner ? <span>Winner: {winner.name}</span> : <span>Live</span>}
      </div>

      {ranked.map((player, index) => (
        <div key={player.id} className="score-row">
          <span>{index + 1}</span>
          <strong>{player.name}</strong>
          <em>{player.score} pts</em>
        </div>
      ))}
    </section>
  );
}
