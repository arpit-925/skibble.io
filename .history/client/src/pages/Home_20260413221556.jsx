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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Skribbl Clone</h1>
      <input
        placeholder="Enter Name"
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />
      <input
        placeholder="Room ID"
        onChange={(e) => setRoom(e.target.value)}
      />
      <br /><br />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}