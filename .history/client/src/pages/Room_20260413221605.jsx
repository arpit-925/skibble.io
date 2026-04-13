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

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Canvas roomId={roomId} />
      <div>
        <Scoreboard />
        <Chat roomId={roomId} />
      </div>
    </div>
  );
}