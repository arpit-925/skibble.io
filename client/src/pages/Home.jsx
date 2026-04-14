import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket, { backendUrl } from "../socket/socket";
import useGame from "../context/useGame";

const avatarColors = ["#d63a30", "#f27a23", "#f0d54f", "#68d442", "#4fd4f6", "#5467f5", "#8a4cf6", "#f08ec7"];
const languages = ["English", "Hindi", "Spanish", "German"];
const wordModes = ["normal", "hidden", "combination"];

export default function Home() {
  const navigate = useNavigate();
  const { playerName, setPlayerName, setRoom, setMessages } = useGame();
  const [name, setName] = useState(playerName || "");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState(languages[0]);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [categories, setCategories] = useState(["general", "animals", "food"]);
  const [publicRooms, setPublicRooms] = useState([]);
  const [settings, setSettings] = useState({
    maxPlayers: 8,
    rounds: 3,
    drawTime: 80,
    hints: 3,
    wordChoices: 3,
    category: "general",
    wordMode: "normal",
  });

  useEffect(() => {
    let ignore = false;

    async function loadHomeData() {
      try {
        const [categoriesResponse, roomsResponse] = await Promise.all([
          fetch(`${backendUrl}/words/categories`),
          fetch(`${backendUrl}/rooms/public`),
        ]);

        if (!ignore && categoriesResponse.ok) {
          const nextCategories = await categoriesResponse.json();
          if (Array.isArray(nextCategories) && nextCategories.length > 0) {
            setCategories(nextCategories);
            setSettings((current) => ({
              ...current,
              category: nextCategories.includes(current.category) ? current.category : nextCategories[0],
            }));
          }
        }

        if (!ignore && roomsResponse.ok) {
          const nextRooms = await roomsResponse.json();
          if (Array.isArray(nextRooms)) setPublicRooms(nextRooms);
        }
      } catch (_error) {
        if (!ignore) setPublicRooms([]);
      }
    }

    loadHomeData();
    return () => {
      ignore = true;
    };
  }, []);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const shiftAvatar = (direction) => {
    setAvatarIndex((current) => (current + direction + avatarColors.length) % avatarColors.length);
  };

  const randomizeAvatar = () => {
    setAvatarIndex((current) => {
      const next = Math.floor(Math.random() * avatarColors.length);
      return next === current ? (next + 1) % avatarColors.length : next;
    });
  };

  const persistName = () => {
    const clean = name.trim() || "Player";
    setPlayerName(clean);
    return clean;
  };

  const createRoom = (isPrivate) => {
    const cleanName = persistName();
    setError("");
    setMessages([]);
    socket.emit("create_room", { name: cleanName, settings: { ...settings, isPrivate, language } }, (response) => {
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
      <section className="home-main classic-home">
        <header className="classic-hero">
          <h1 className="classic-logo" aria-label="skribbl.io">
            <span style={{ color: "#fa5344" }}>s</span>
            <span style={{ color: "#ff8c1f" }}>k</span>
            <span style={{ color: "#f2dd3a" }}>r</span>
            <span style={{ color: "#63db47" }}>i</span>
            <span style={{ color: "#44d4f0" }}>b</span>
            <span style={{ color: "#556bff" }}>b</span>
            <span style={{ color: "#af4fff" }}>l</span>
            <span style={{ color: "#ff7bc6" }}>.</span>
            <span style={{ color: "#ffffff" }}>io</span>
            <span className="logo-pencil">!</span>
          </h1>

          <div className="mascot-row" aria-hidden="true">
            {avatarColors.map((color, index) => (
              <span
                key={color}
                className={`mascot ${index === avatarIndex ? "active" : ""}`}
                style={{ "--mascot-color": color }}
              />
            ))}
          </div>
        </header>

        <section className="start-card">
          <div className="start-card-top">
            <input
              aria-label="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              maxLength={24}
            />
            <select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languages.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="avatar-picker">
            <button type="button" className="avatar-arrow" onClick={() => shiftAvatar(-1)} aria-label="Previous avatar">
              {"<"}
            </button>
            <button type="button" className="avatar-arrow" onClick={() => shiftAvatar(-1)} aria-label="Previous avatar color">
              {"<"}
            </button>
            <div className="avatar-preview" style={{ "--avatar-color": avatarColors[avatarIndex] }}>
              <span className="avatar-face" />
            </div>
            <button type="button" className="avatar-arrow" onClick={() => shiftAvatar(1)} aria-label="Next avatar color">
              {">"}
            </button>
          <button type="button" className="avatar-arrow" onClick={() => shiftAvatar(1)} aria-label="Next avatar">
              {">"}
            </button>
            <button type="button" className="dice-button" onClick={randomizeAvatar} aria-label="Random avatar">
              ?
            </button>
          </div>

          <button className="play-action" onClick={() => createRoom(false)}>
            Play!
          </button>
          <button className="private-action" onClick={() => createRoom(true)}>
            Create Private Room
          </button>

          <button type="button" className="settings-toggle" onClick={() => setShowSettings((current) => !current)}>
            {showSettings ? "Hide room settings" : "Room settings"}
          </button>

          {showSettings && (
            <div className="room-settings-grid">
              <label>
                Max players
                <input type="number" min="2" max="20" value={settings.maxPlayers} onChange={(event) => updateSetting("maxPlayers", Number(event.target.value))} />
              </label>
              <label>
                Rounds
                <input type="number" min="2" max="20" value={settings.rounds} onChange={(event) => updateSetting("rounds", Number(event.target.value))} />
              </label>
              <label>
                Draw time
                <input type="number" min="15" max="240" value={settings.drawTime} onChange={(event) => updateSetting("drawTime", Number(event.target.value))} />
              </label>
              <label>
                Hints
                <input type="number" min="0" max="5" value={settings.hints} onChange={(event) => updateSetting("hints", Number(event.target.value))} />
              </label>
              <label>
                Word choices
                <input type="number" min="1" max="5" value={settings.wordChoices} onChange={(event) => updateSetting("wordChoices", Number(event.target.value))} />
              </label>
              <label>
                Category
                <select value={settings.category} onChange={(event) => updateSetting("category", event.target.value)}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="room-settings-wide">
                Word mode
                <select value={settings.wordMode} onChange={(event) => updateSetting("wordMode", event.target.value)}>
                  {wordModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="join-row">
            <input
              aria-label="Room code"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
              placeholder="Room code"
              maxLength={8}
            />
            <button className="join-action" onClick={joinRoom}>
              Join
            </button>
          </div>

          {error && <p className="form-error">{error}</p>}

          {publicRooms.length > 0 && (
            <div className="public-room-strip">
              <p>Open rooms</p>
              <div className="public-room-list">
                {publicRooms.slice(0, 4).map((room) => (
                  <button key={room.id} type="button" className="public-room-chip" onClick={() => setRoomCode(room.id)}>
                    {room.id} · {room.players}/{room.maxPlayers}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="classic-info-band">
          <article className="info-column">
            <p className="info-icon">?</p>
            <h2>About</h2>
            <p>skribbl.io is a free online multiplayer drawing and guessing game.</p>
            <p>A few rounds, one secret word, a fast sketch, and everyone else trying to catch it before the timer runs out.</p>
            <p>The player with the most points at the end wins.</p>
          </article>

          <article className="info-column">
            <p className="info-icon">N</p>
            <h2>News</h2>
            <div className="news-card">
              <div className="news-head">
                <strong>Fresh paint</strong>
                <span>April 14, 2026</span>
              </div>
              <ul>
                <li>Classic first screen rebuilt for quicker play.</li>
                <li>Single-tap public room start with the same live backend flow.</li>
                <li>Private room join stays on the front page.</li>
              </ul>
            </div>
          </article>

          <article className="info-column">
            <p className="info-icon">!</p>
            <h2>How to play</h2>
            <div className="howto-art" aria-hidden="true">
              <span>CHOOSE A</span>
              <span>WORD!</span>
              <div className="word-tiles">
                <b />
                <b className="active">HOUSE</b>
                <b />
              </div>
            </div>
            <p>When it&apos;s your turn, choose a word and draw it. Everyone else races to guess it first.</p>
          </article>
        </section>

        <footer className="classic-footer">
          <a href="/">Contact</a>
          <a href="/">Terms of Service</a>
          <a href="/">Credits</a>
          <a href="/">Privacy Settings</a>
        </footer>
      </section>
    </main>
  );
}
