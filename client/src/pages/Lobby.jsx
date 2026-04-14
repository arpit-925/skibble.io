import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import socket from "../socket/socket";
import useGame from "../context/useGame";
import useSocket from "../hooks/useSocket";
import PlayerList from "../components/PlayerList";

export default function Lobby() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { room, setRoom, playerName } = useGame();
  const players = room?.players || [];
  const currentPlayer = players.find((player) => player.id === socket.id);
  const isHost = currentPlayer?.isHost;

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
      if (state.game?.status !== "lobby") navigate(`/room/${roomId}`);
    }
  });

  useSocket("round_start", () => navigate(`/room/${roomId}`));

  const startGame = () => {
    socket.emit("start_game", { roomId });
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
              <button className="primary-action" onClick={startGame} disabled={players.length < 2}>
                Start game
              </button>
            )}
            <Link className="secondary-link" to="/">Leave lobby</Link>
          </div>
        </div>

        <PlayerList players={players} />
      </section>
    </main>
  );
}
