import { useState } from "react";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";

export default function Chat({ roomId }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useSocket("chat_message", (data) => {
    setMessages((prev) => [...prev, `${data.playerName}: ${data.text}`]);
  });

  useSocket("guess_result", (data) => {
    setMessages((prev) => [
      ...prev,
      `🎉 ${data.playerName} guessed correctly! +${data.points}`,
    ]);
  });

  const send = () => {
    socket.emit("chat", { roomId, text: msg });
    setMsg("");
  };

  return (
    <div className="flex flex-col flex-1">

      <div className="flex-1 overflow-y-auto p-3 bg-gray-100">
        {messages.map((m, i) => (
          <p key={i} className="text-sm">{m}</p>
        ))}
      </div>

      <div className="p-2 flex gap-2 border-t">
        <input
          className="flex-1 p-2 border rounded-full"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-full"
          onClick={send}
        >
          ➤
        </button>
      </div>

    </div>
  );
}