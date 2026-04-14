import { useRef, useState } from "react";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";
import Toolbar from "./Toolbar";

export default function Canvas({ roomId }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const prev = useRef({ x: 0, y: 0 });

  const [color, setColor] = useState("#000");
  const [size, setSize] = useState(3);

  useSocket("draw", ({ x, y, prevX, prevY, color, size }) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();
  });

  const start = (e) => {
    drawing.current = true;
    const rect = canvasRef.current.getBoundingClientRect();
    prev.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const draw = (e) => {
    if (!drawing.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(prev.current.x, prev.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();

    socket.emit("draw", {
      roomId,
      x,
      y,
      prevX: prev.current.x,
      prevY: prev.current.y,
      color,
      size,
    });

    prev.current = { x, y };
  };

  return (
    <div className="flex flex-col items-center">
      <Toolbar roomId={roomId} setColor={setColor} setSize={setSize} />

      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className="bg-white border rounded"
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={() => (drawing.current = false)}
        onMouseLeave={() => (drawing.current = false)}
      />
    </div>
  );
}