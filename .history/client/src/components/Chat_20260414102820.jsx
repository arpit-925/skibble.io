import { useState } from "react";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";

export default function Chat({ roomId }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useSocket("chat_message", (data) => {
    setMessages((prev) => [...prev, `${data.playerName}: ${data.text}`]);
  });

  const send = () => {
    socket.emit("chat", { roomId, text: msg });
    setMsg("");
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((m, i) => <p key={i}>{m}</p>)}
      </div>

      <div className="flex">
        <input
          className="flex-1 border p-1"
          onChange={(e) => setMsg(e.target.value)}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}