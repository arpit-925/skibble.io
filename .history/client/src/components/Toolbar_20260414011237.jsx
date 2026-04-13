import socket from "../socket/socket";

export default function Toolbar({ roomId, setColor, setSize }) {
  return (
    <div className="flex gap-2 mb-2">
      <button onClick={() => setColor("black")}>Black</button>
      <button onClick={() => setColor("red")}>Red</button>
      <button onClick={() => setColor("blue")}>Blue</button>

      <button onClick={() => setSize(2)}>Thin</button>
      <button onClick={() => setSize(5)}>Medium</button>
      <button onClick={() => setSize(10)}>Thick</button>

      <button
        onClick={() =>
          socket.emit("canvas_clear", { roomId })
        }
      >
        Clear
      </button>
    </div>
  );
}