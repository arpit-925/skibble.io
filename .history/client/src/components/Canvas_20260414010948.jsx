import { useRef, useState } from "react";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";
import Toolbar from "./Toolbar";

export default function Canvas({ roomId }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const [color, setColor] = useState("black");
  const [size, setSize] = useState(2);

  // 🔥 DRAW FROM OTHER USERS
  useSocket("draw", ({ x, y, color, size }) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
  });

  const startDrawing = (e) => {
    drawing.current = true;

    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath(); // IMPORTANT

    const rect = canvasRef.current.getBoundingClientRect();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  };

  const draw = (e) => {
    if (!drawing.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");

    // 🔥 DRAW LOCALLY FIRST
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";

    ctx.lineTo(x, y);
    ctx.stroke();

    // 🔥 THEN SEND TO SERVER
    socket.emit("draw", { roomId, x, y, color, size });
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  return (
    <div className="flex flex-col items-center">
      
      <Toolbar roomId={roomId} setColor={setColor} setSize={setSize} />

      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className="border rounded cursor-crosshair bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}