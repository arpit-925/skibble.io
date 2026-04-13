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
    if (!msg) return;
    socket.emit("chat", { roomId, text: msg });
    setMsg("");
  };

  return (
    <div className="flex flex-col flex-1 mt-4">
      
      <div className="flex-1 overflow-y-auto border p-2 rounded mb-2 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className="text-sm mb-1">
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type guess..."
        />
        <button
          className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

    </div>
  );
}