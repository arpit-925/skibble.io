import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";

import Canvas from "../components/Canvas";
import Chat from "../components/Chat";
import Lobby from "../components/Lobby";
import Scoreboard from "../components/Scoreboard";

export default function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const name = location.state?.name;

  useEffect(() => {
    socket.emit("join_room", { roomId, name });

    return () => {
      socket.off();
    };
  }, []);

  // 🔥 Word selection for drawer
  useSocket("word_options", (options) => {
    const chosen = prompt(
      "Choose a word:\n" + options.join(", ")
    );

    if (chosen) {
      socket.emit("word_chosen", { roomId, word: chosen });
    }
  });

  // 🔥 Show word length
  useSocket("word_length", (length) => {
    console.log("Word length:", length);
  });

  return (
    <div className="h-screen flex bg-gray-100">
      
      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center">
        <Canvas roomId={roomId} />
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white p-4 flex flex-col">
        <Lobby roomId={roomId} name={name} />
        <Scoreboard />
        <Chat roomId={roomId} />
      </div>

    </div>
  );
}