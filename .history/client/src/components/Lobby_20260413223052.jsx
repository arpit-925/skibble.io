import { useEffect, useState } from "react";
import socket from "../socket/socket";

export default function Lobby({ roomId, name }) {
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState(null);

  useEffect(() => {
    // Join room
    socket.emit("join_room", { roomId, name });

    // Listen for players update
    socket.on("player_list", ({ players, host }) => {
      setPlayers(players);
      setHost(host);
    });

    return () => {
      socket.off("player_list");
    };
  }, []);

  const startGame = () => {
    socket.emit("start_game", { roomId });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        
        <h2 className="text-xl font-bold mb-4 text-center">
          🧑‍🤝‍🧑 Lobby - Room {roomId}
        </h2>

        {/* Players List */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Players:</h3>
          <ul className="space-y-2">
            {players.map((p, i) => (
              <li
                key={i}
                className="p-2 bg-gray-100 rounded flex justify-between"
              >
                <span>{p.name}</span>
                {p.id === host && (
                  <span className="text-xs text-green-600 font-semibold">
                    Host
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Start Button (Host Only) */}
        {name === host && (
          <button
            onClick={startGame}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Start Game
          </button>
        )}

      </div>

    </div>
  );
}