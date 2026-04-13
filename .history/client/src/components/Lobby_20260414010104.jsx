import { useState } from "react";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";

export default function Lobby({ roomId, name }) {
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState(null);

  useSocket("player_list", ({ players, host }) => {
    setPlayers(players);
    setHost(host);
  });

  const startGame = () => {
    socket.emit("start_game", { roomId });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-6 rounded-xl shadow w-96">
        
        <h2 className="text-xl font-bold mb-4 text-center">
          Lobby
        </h2>

        {players.map((p) => (
          <div key={p.id} className="p-2 bg-gray-100 mb-1 rounded">
            {p.name}
          </div>
        ))}

        {/* HOST ONLY BUTTON */}
        {host && (
          <button
            onClick={startGame}
            className="w-full bg-blue-500 text-white p-2 mt-4 rounded"
          >
            Start Game
          </button>
        )}

      </div>
    </div>
  );
}