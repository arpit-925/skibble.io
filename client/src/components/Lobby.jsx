import PlayerList from "./PlayerList";

export default function Lobby({ roomId, players, isHost, onStart }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Lobby</h2>
        <span>{roomId}</span>
      </div>
      <PlayerList players={players} />
      {isHost && (
        <button className="primary-action" onClick={onStart} disabled={players.length < 2}>
          Start game
        </button>
      )}
    </section>
  );
}
