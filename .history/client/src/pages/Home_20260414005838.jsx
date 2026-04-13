import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (!name || !room) return;
    navigate(`/room/${room}`, { state: { name } });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">🎨 Skribbl Clone</h1>

        <input
          className="w-full p-3 border rounded mb-3"
          placeholder="Your Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Room ID"
          onChange={(e) => setRoom(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 text-white p-3 rounded-lg"
          onClick={joinRoom}
        >
          Join Game
        </button>
      </div>
    </div>
  );
}