import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8);
    setRoom(id);
  };

  const joinRoom = () => {
    if (!name || !room) {
      alert("Please enter name and room ID");
      return;
    }

    navigate(`/room/${room}`, { state: { name } });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
        
        <h1 className="text-3xl font-bold mb-6">🎨 Skribbl Clone</h1>

        {/* Name Input */}
        <input
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Room Input */}
        <input
          className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        {/* Generate Room */}
        <button
          onClick={generateRoomId}
          className="text-sm text-blue-500 mb-4 hover:underline"
        >
          Generate Room ID
        </button>

        {/* Join Button */}
        <button
          onClick={joinRoom}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
        >
          Join Room
        </button>

      </div>

    </div>
  );
}