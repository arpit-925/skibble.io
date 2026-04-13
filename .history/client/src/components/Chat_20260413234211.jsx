import { useState } from "react";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";

export default function Chat({ roomId }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useSocket("chat_message", (data) => {
    setMessages((prev) => [...prev, data]);
  });
  useSocket("guess_result", (data) => {
  alert(`${data.playerName} guessed correctly! +${data.points}`);
});

  const send = () => {
    socket.emit("chat", { roomId, text: msg });
    setMsg("");
  };

  return (
    <div>
      <div>
        {messages.map((m, i) => (
          <p key={i}>{m.text}</p>
        ))}
      </div>

      <input onChange={(e) => setMsg(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}