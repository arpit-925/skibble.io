import { useRef, useState } from "react";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";

export default function Canvas({ roomId }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const [color, setColor] = useState("black");
  const [size, setSize] = useState(2);

  useSocket("draw", ({ x, y, color, size }) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineTo(x, y);
    ctx.stroke();
  });

  const startDrawing = (e) => {
    drawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();

    const rect = canvasRef.current.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!drawing.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    socket.emit("draw", { roomId, x, y, color, size });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className="border rounded cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={() => (drawing.current = false)}
      />
    </div>
  );
}