import { useState } from "react";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";

export default function Chat({ roomId }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  // 🔥 Normal chat messages
  useSocket("chat_message", (data) => {
    setMessages((prev) => [...prev, `${data.playerName}: ${data.text}`]);
  });

  // 🔥 Correct guess notification
  useSocket("guess_result", (data) => {
    setMessages((prev) => [
      ...prev,
      `🎉 ${data.playerName} guessed correctly! +${data.points}`,
    ]);
  });

  const sendMessage = () => {
    if (!msg) return;

    socket.emit("chat", { roomId, text: msg });
    setMsg("");
  };

  return (
    <div className="flex flex-col h-full p-2">
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded mb-2">
        {messages.map((m, i) => (
          <p key={i} className="text-sm mb-1">{m}</p>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type guess..."
        />
        <button
          className="bg-blue-500 text-white px-3 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

    </div>
  );
}