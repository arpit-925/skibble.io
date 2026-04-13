import { useState } from "react";
import useSocket from "../hooks/useSocket";

export default function Scoreboard() {
  const [players, setPlayers] = useState([]);

  useSocket("round_end", ({ scores }) => {
    setPlayers(scores);
  });

  return (
    <div className="p-3 border-b">
      <h2 className="font-bold mb-2">Players</h2>

      {players.map((p) => (
        <div
          key={p.id}
          className="flex justify-between bg-gray-100 p-2 rounded mb-1"
        >
          <span>{p.name}</span>
          <span>{p.score}</span>
        </div>
      ))}
    </div>
  );
}