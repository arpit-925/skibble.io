import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";

import Canvas from "../components/Canvas";
import Chat from "../components/Chat";
import Scoreboard from "../components/Scoreboard";
import Lobby from "../components/Lobby";

export default function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const name = location.state?.name;

  const [gameStarted, setGameStarted] = useState(false);
  const [wordLength, setWordLength] = useState(0);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    socket.emit("join_room", { roomId, name });
    return () => socket.off();
  }, []);

  // 🎮 Start Game
  useSocket("round_start", () => {
    setGameStarted(true);
  });

  useSocket("word_length", (len) => {
    setWordLength(len);
  });

  // Timer UI
  useEffect(() => {
    if (!gameStarted) return;

    const i = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 60));
    }, 1000);

    return () => clearInterval(i);
  }, [gameStarted]);

  // WORD SELECTION
  useSocket("word_options", (options) => {
    const chosen = prompt("Choose:\n" + options.join(", "));
    if (chosen) {
      socket.emit("word_chosen", { roomId, word: chosen });
    }
  });

  // 🔴 SHOW LOBBY FIRST
  if (!gameStarted) {
    return <Lobby roomId={roomId} name={name} />;
  }

  // 🟢 GAME SCREEN
  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* TOP BAR */}
      <div className="bg-white shadow p-3 flex justify-between">
        <div>Word: {"_ ".repeat(wordLength)}</div>
        <div className="text-red-500">⏱ {timer}s</div>
      </div>

      <div className="flex flex-1">

        {/* CANVAS */}
        <div className="flex-1 flex justify-center items-center">
          <Canvas roomId={roomId} />
        </div>

        {/* SIDEBAR */}
        <div className="w-80 bg-white flex flex-col shadow">
          <Scoreboard />
          <Chat roomId={roomId} />
        </div>

      </div>
    </div>
  );
}