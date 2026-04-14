import { Link, useParams } from "react-router-dom";
import socket from "../socket/socket";
import Canvas from "../components/Canvas";
import Chat from "../components/Chat";
import PlayerList from "../components/PlayerList";
import Scoreboard from "../components/Scoreboard";
import useSocket from "../hooks/useSocket";
import useGame from "../context/useGame";

export default function Room() {
  const { roomId } = useParams();
  const { room, setRoom, messages, setMessages } = useGame();
  const game = room?.game || {};
  const players = room?.players || [];
  const isDrawer = game.drawerId === socket.id;
  const currentPlayer = players.find((player) => player.id === socket.id);
  const canChat = game.status === "drawing" && !currentPlayer?.hasGuessed;
  const winner = game.status === "game_over" ? [...players].sort((a, b) => b.score - a.score)[0] : null;

  useSocket("game_state", (state) => {
    if (state?.id === roomId) setRoom(state);
  });

  useSocket("chat_message", (message) => {
    setMessages((current) => [...current.slice(-80), message]);
  });

  useSocket("guess_result", (result) => {
    setMessages((current) => [
      ...current.slice(-80),
      {
        id: Date.now(),
        type: "system",
        text: `${result.playerName} guessed correctly for ${result.points} points.`,
      },
    ]);
  });

  useSocket("round_end", (result) => {
    setMessages((current) => [
      ...current.slice(-80),
      {
        id: Date.now(),
        type: "system",
        text: `Round ended. The word was "${result.word}".`,
      },
    ]);
  });

  useSocket("game_over", (result) => {
    setMessages((current) => [
      ...current.slice(-80),
      {
        id: Date.now(),
        type: "system",
        text: `${result.winner?.name || "Nobody"} wins the game.`,
      },
    ]);
  });

  const chooseWord = (word) => {
    socket.emit("word_chosen", { roomId, word });
  };

  return (
    <main className="game-page">
      <header className="game-topbar">
        <div>
          <p className="eyebrow">Round {game.round || 1} of {game.totalRounds || room?.settings?.rounds || 1}</p>
          <h1>{game.status === "selecting" ? "Choose a word" : game.hint || game.maskedWord || "Waiting for word"}</h1>
        </div>
        <div className="timer">{game.timeLeft ?? room?.settings?.drawTime ?? 0}s</div>
      </header>

      {isDrawer && game.status === "selecting" && (
        <section className="word-picker">
          <h2>Pick one to draw</h2>
          <div>
            {(game.wordOptions || []).map((word) => (
              <button key={word} onClick={() => chooseWord(word)}>{word}</button>
            ))}
          </div>
        </section>
      )}

      {game.status === "game_over" && (
        <section className="word-picker">
          <h2>{winner?.name || "Nobody"} wins</h2>
          <Link className="secondary-link" to="/">Play again</Link>
        </section>
      )}

      <section className="game-layout">
        <aside className="sidebar-left">
          <PlayerList players={players} drawerId={game.drawerId} />
          <Scoreboard players={players} winner={winner} />
        </aside>

        <Canvas roomId={roomId} isDrawer={isDrawer && game.status === "drawing"} />

        <aside className="sidebar-right">
          <section className="panel">
            <div className="panel-header">
              <h2>Turn</h2>
              <span>{game.status || "loading"}</span>
            </div>
            <p className="turn-text">
              {isDrawer ? "You are drawing." : `${players.find((player) => player.id === game.drawerId)?.name || "Someone"} is drawing.`}
            </p>
          </section>
          <Chat roomId={roomId} messages={messages} disabled={!canChat && !isDrawer} isDrawer={isDrawer} />
        </aside>
      </section>
    </main>
  );
}
