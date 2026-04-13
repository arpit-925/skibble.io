import { useState, useEffect } from "react";
import socket from "../socket/socket";

export default function Chat({ roomId }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("chat_message");
  }, []);

  const sendMessage = () => {
    socket.emit("chat", { roomId, text: msg });
    setMsg("");
  };

  return (
    <div>
      <div style={{ height: "200px", overflow: "auto" }}>
        {messages.map((m, i) => (
          <div key={i}>{m.text}</div>
        ))}
      </div>
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}