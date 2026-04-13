import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";

import Canvas from "../components/Canvas";
import Chat from "../components/Chat";
import Scoreboard from "../components/Scoreboard";

export default function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const name = location.state?.name;

  const [wordLength, setWordLength] = useState(0);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    socket.emit("join_room", { roomId, name });

    return () => socket.off();
  }, []);

  // Word hint display
  useSocket("word_length", (length) => {
    setWordLength(length);
  });

  // Fake timer (UI only for now)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#f0f2f5]">

      {/* 🔥 TOP BAR */}
      <div className="bg-white shadow p-3 flex justify-between items-center">
        <div className="text-lg font-semibold">
          Word: {"_ ".repeat(wordLength)}
        </div>
        <div className="text-lg font-bold text-red-500">
          ⏱ {timer}s
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1">

        {/* 🎨 Canvas */}
        <div className="flex-1 flex justify-center items-center">
          <Canvas roomId={roomId} />
        </div>

        {/* 📊 Sidebar */}
        <div className="w-80 bg-white shadow-lg flex flex-col">
          <Scoreboard />
          <Chat roomId={roomId} />
        </div>

      </div>
    </div>
  );
}