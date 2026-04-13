import { useRef, useState, useEffect } from "react";
import socket from "../socket/socket";
import useSocket from "../hooks/useSocket";
import Toolbar from "./Toolbar";

export default function Canvas({ roomId }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const [color, setColor] = useState("black");
  const [size, setSize] = useState(2);

  // 🎯 Listen for drawing from others
  useSocket("draw", ({ x, y, color, size }) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
  });

  // 🎯 Clear canvas
  useSocket("canvas_clear", () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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

    // send to server
    socket.emit("draw", { roomId, x, y, color, size });
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  return (
    <div className="flex flex-col items-center">
      
      {/* Toolbar */}
      <Toolbar roomId={roomId} setColor={setColor} setSize={setSize} />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className="bg-white border-2 border-gray-300 rounded-xl shadow cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

    </div>
  );
}