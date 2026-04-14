export default function PlayerList({ players }) {
  return (
    <div className="p-3 border-b">
      <h2 className="font-bold">Players</h2>

      {players.map((p) => (
        <div key={p.id} className="flex justify-between">
          <span>{p.name}</span>
          <span>{p.score}</span>
        </div>
      ))}
    </div>
  );
}