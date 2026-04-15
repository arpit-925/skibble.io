import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import socket from "../socket/socket";
import useGame from "../context/useGame";
import useSocket from "../hooks/useSocket";
import PlayerList from "../components/PlayerList";

export default function Lobby() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { room, setRoom, playerName } = useGame();
  const [error, setError] = useState("");
  const players = room?.players || [];
  const currentPlayer = players.find((player) => player.id === socket.id);
  const isHost = currentPlayer?.isHost || room?.hostId === socket.id;
  const canStart = players.length >= 2;

  useEffect(() => {
    if (!room && playerName) {
      socket.emit("join_room", { roomId, name: playerName }, (response) => {
        if (response?.ok) setRoom(response.room);
      });
    }
  }, [playerName, room, roomId, setRoom]);

  useSocket("game_state", (state) => {
    if (state?.id === roomId) {
      setRoom(state);
      setError("");
      if (state.game?.status !== "lobby") navigate(`/room/${roomId}`);
    }
  });

  useSocket("round_start", () => navigate(`/room/${roomId}`));

  const startGame = () => {
    setError("");
    socket.emit("start_game", { roomId }, (response) => {
      if (!response?.ok) {
        setError(response?.error || "Could not start the game.");
      }
    });
  };

  return (
    <main className="lobby-page">
      <section className="lobby-content">
        <div className="lobby-copy">
          <p className="eyebrow">Room {roomId}</p>
          <h1>Waiting for players</h1>
          <p className="lede">Share the code with friends. The host can start when at least two players have joined.</p>

          <div className="room-code">{roomId}</div>

          <div className="lobby-actions">
            {isHost && (
              <button className="primary-action" onClick={startGame} disabled={!canStart}>
                Start game
              </button>
            )}
            <Link className="secondary-link" to="/">Leave lobby</Link>
          </div>
          {isHost && !canStart && <p className="form-error">At least 2 players are required to start the game.</p>}
          {error && <p className="form-error">{error}</p>}
        </div>

        <PlayerList players={players} />
      </section>
    </main>
  );
}
