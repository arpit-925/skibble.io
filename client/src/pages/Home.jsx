import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";
import useGame from "../context/useGame";

export default function Home() {
  const navigate = useNavigate();
  const { playerName, setPlayerName, setRoom, setMessages } = useGame();
  const [name, setName] = useState(playerName || "");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [settings, setSettings] = useState({
    maxPlayers: 8,
    rounds: 3,
    drawTime: 80,
    hints: 3,
    isPrivate: false,
    category: "general",
  });

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const persistName = () => {
    const clean = name.trim() || "Player";
    setPlayerName(clean);
    return clean;
  };

  const createRoom = () => {
    const cleanName = persistName();
    setError("");
    setMessages([]);
    socket.emit("create_room", { name: cleanName, settings }, (response) => {
      if (!response?.ok) {
        setError(response?.error || "Could not create room.");
        return;
      }
      setRoom(response.room);
      navigate(`/lobby/${response.roomId}`);
    });
  };

  const joinRoom = () => {
    const cleanName = persistName();
    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode) {
      setError("Enter a room code.");
      return;
    }

    setError("");
    setMessages([]);
    socket.emit("join_room", { roomId: cleanCode, name: cleanName }, (response) => {
      if (!response?.ok) {
        setError(response?.error || "Could not join room.");
        return;
      }
      setRoom(response.room);
      navigate(`/lobby/${response.roomId}`);
    });
  };

  return (
    <main className="home-page">
      <section className="home-main">
        <p className="eyebrow">Realtime drawing and guessing</p>
        <h1>Draw fast. Guess faster.</h1>
        <p className="lede">Create a room, pick a word, and race the clock with friends.</p>

        <div className="home-grid">
          <div className="setup-panel">
            <label>
              Display name
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" maxLength={24} />
            </label>

            <div className="settings-grid">
              <label>
                Max players
                <input type="number" min="2" max="20" value={settings.maxPlayers} onChange={(event) => updateSetting("maxPlayers", Number(event.target.value))} />
              </label>
              <label>
                Rounds
                <input type="number" min="2" max="10" value={settings.rounds} onChange={(event) => updateSetting("rounds", Number(event.target.value))} />
              </label>
              <label>
                Draw time
                <input type="number" min="15" max="240" value={settings.drawTime} onChange={(event) => updateSetting("drawTime", Number(event.target.value))} />
              </label>
              <label>
                Hints
                <input type="number" min="0" max="5" value={settings.hints} onChange={(event) => updateSetting("hints", Number(event.target.value))} />
              </label>
            </div>

            <label>
              Category
              <select value={settings.category} onChange={(event) => updateSetting("category", event.target.value)}>
                <option value="general">General</option>
                <option value="animals">Animals</option>
                <option value="food">Food</option>
              </select>
            </label>

            <label className="inline-check">
              <input type="checkbox" checked={settings.isPrivate} onChange={(event) => updateSetting("isPrivate", event.target.checked)} />
              Private room
            </label>

            <button className="primary-action" onClick={createRoom}>Create room</button>
          </div>

          <div className="setup-panel">
            <h2>Join a room</h2>
            <label>
              Room code
              <input value={roomCode} onChange={(event) => setRoomCode(event.target.value.toUpperCase())} placeholder="ABC123" maxLength={8} />
            </label>
            <button className="secondary-action" onClick={joinRoom}>Join room</button>
            {error && <p className="form-error">{error}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
