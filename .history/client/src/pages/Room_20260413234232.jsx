import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "../socket/socket";
import Canvas from "../components/Canvas";
import Chat from "../components/Chat";
import Lobby from "../components/Lobby";

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
  useSocket("word_options", (options) => {
  const chosen = prompt("Choose word:\n" + options.join(", "));
  socket.emit("word_chosen", { roomId, word: chosen });
});

  return (
    <div className="flex">
      <Canvas roomId={roomId} />
      <div className="w-80">
        <Lobby roomId={roomId} name={name} />
        <Chat roomId={roomId} />
      </div>
    </div>
  );
}