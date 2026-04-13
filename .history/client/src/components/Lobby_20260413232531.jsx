import { useState } from "react";
import useSocket from "../hooks/useSocket";

export default function Lobby({ roomId }) {
  const [players, setPlayers] = useState([]);

  useSocket("player_list", ({ players }) => {
    setPlayers(players);
  });

  return (
    <div>
      <h3>Players</h3>
      {players.map((p) => (
        <p key={p.id}>{p.name}</p>
      ))}
    </div>
  );
}