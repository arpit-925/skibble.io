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
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 shadow rounded">
        <h1 className="text-xl mb-4">Join Game</h1>

        <input
          className="border p-2 mb-2 w-full"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 mb-2 w-full"
          placeholder="Room ID"
          onChange={(e) => setRoom(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={joinRoom}
        >
          Join
        </button>
      </div>
    </div>
  );
}