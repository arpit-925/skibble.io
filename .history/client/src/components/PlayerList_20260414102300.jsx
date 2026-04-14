export default function PlayerList({ players }) {
  return (
    <div className="p-3 border-b">
      <h2 className="font-bold mb-2">Players</h2>

      {players.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between bg-gray-100 p-2 rounded mb-1"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white">
              {p.name[0].toUpperCase()}
            </div>
            <span>{p.name}</span>
          </div>

          <span className="font-bold">{p.score}</span>
        </div>
      ))}
    </div>
  );
}