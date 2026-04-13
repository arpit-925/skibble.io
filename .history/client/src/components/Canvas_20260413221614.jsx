import { useRef, useEffect } from "react";
import socket from "../socket/socket";

export default function Canvas({ roomId }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    socket.on("draw", ({ x, y }) => {
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    return () => socket.off("draw");
  }, []);

  const startDrawing = (e) => {
    drawing.current = true;
  };

  const draw = (e) => {
    if (!drawing.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    socket.emit("draw", { roomId, x, y });
  };

  const stopDrawing = () => {
    drawing.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={400}
      style={{ border: "1px solid black" }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
    />
  );
}