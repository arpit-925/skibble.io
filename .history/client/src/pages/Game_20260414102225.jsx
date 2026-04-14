import { useEffect, useState } from "react";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";

import Canvas from "../components/Canvas";
import Chat from "../components/Chat";
import PlayerList from "../components/PlayerList";

export default function Game() {
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState([]);
  const [wordLength, setWordLength] = useState(0);

  // Join room
  const join = () => {
    socket.emit("join_room", { roomId, name });
    setJoined(true);
  };

  useSocket("player_list", ({ players }) => {
    setPlayers(players);
  });

  useSocket("word_length", (len) => {
    setWordLength(len);
  });

  // 🎮 BEFORE JOIN (same page)
  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300">
        <div className="bg-white p-6 rounded-xl shadow w-80 text-center">
          <h1 className="text-xl font-bold mb-4">🎨 Skribbl Clone</h1>

          <input
            className="w-full p-2 border mb-2"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-2 border mb-3"
            placeholder="Room ID"
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button
            onClick={join}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  // 🎮 GAME SCREEN
  return (
    <div className="h-screen flex flex-col bg-[#f0f2f5]">

      {/* TOP BAR */}
      <div className="bg-white shadow p-3 flex justify-center text-lg font-bold">
        Word: {"_ ".repeat(wordLength)}
      </div>

      <div className="flex flex-1">

        {/* CANVAS */}
        <div className="flex-1 flex justify-center items-center">
          <Canvas roomId={roomId} />
        </div>

        {/* SIDEBAR */}
        <div className="w-80 bg-white flex flex-col shadow-lg">
          <PlayerList players={players} />
          <Chat roomId={roomId} />
        </div>

      </div>
    </div>
  );
}