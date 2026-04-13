import { useState } from "react";
import socket from "../socket/socket";

export default function Toolbar({ roomId, setColor, setSize }) {
  const [activeColor, setActiveColor] = useState("black");
  const [activeSize, setActiveSize] = useState(3);

  const colors = [
    "#000000",
    "#ff0000",
    "#007bff",
    "#28a745",
    "#ffc107",
    "#6f42c1",
    "#fd7e14",
  ];

  const sizes = [2, 5, 10];

  const handleColor = (c) => {
    setActiveColor(c);
    setColor(c);
  };

  const handleSize = (s) => {
    setActiveSize(s);
    setSize(s);
  };

  const clearCanvas = () => {
    socket.emit("canvas_clear", { roomId });
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-3 mb-3 w-fit">

      {/* 🎨 COLORS */}
      <div className="flex gap-2 mb-3">
        {colors.map((c, i) => (
          <button
            key={i}
            onClick={() => handleColor(c)}
            className={`w-6 h-6 rounded-full border-2 transition ${
              activeColor === c
                ? "border-black scale-110"
                : "border-gray-300"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* 🖌 BRUSH SIZE */}
      <div className="flex gap-2 mb-3">
        {sizes.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSize(s)}
            className={`px-3 py-1 rounded text-sm ${
              activeSize === s
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {s}px
          </button>
        ))}
      </div>

      {/* 🧹 ACTIONS */}
      <div className="flex gap-2">
        <button
  onClick={() => socket.emit("draw_undo", { roomId })}
  className="bg-yellow-500 text-white px-3 py-1 rounded"
>
  Undo
</button>
        <button
          onClick={clearCanvas}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>

    </div>
  );
}