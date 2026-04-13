import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "../socket/socket";
import Canvas from "../components/Canvas";
import Chat from "../components/Chat";
import Scoreboard from "../components/Scoreboard";

export default function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const name = location.state?.name;

  useEffect(() => {
    socket.emit("join_room", { roomId, name });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="h-screen flex bg-gray-100">
      
      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center">
        <Canvas roomId={roomId} />
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg p-4 flex flex-col">
        <Scoreboard />
        <Chat roomId={roomId} />
      </div>

    </div>
  );
}