import { useState } from "react";
import useSocket from "../hooks/useSocket";

export default function Scoreboard() {
  const [players, setPlayers] = useState([]);

  // 🔥 Update scores after each round
  useSocket("round_end", ({ scores }) => {
    setPlayers(scores);
  });

  return (
    <div className="mb-4">
      
      <h2 className="text-lg font-semibold mb-2">
        🏆 Scoreboard
      </h2>

      <div className="bg-gray-100 p-2 rounded">
        {players.length === 0 ? (
          <p className="text-sm text-gray-500">
            No scores yet
          </p>
        ) : (
          players.map((p) => (
            <div
              key={p.id}
              className="flex justify-between text-sm mb-1"
            >
              <span>{p.name}</span>
              <span>{p.score}</span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}