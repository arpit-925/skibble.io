import { useState } from "react";
import socket from "../socket/socket";

export default function Toolbar({ roomId, setColor, setSize }) {
  const [activeColor, setActiveColor] = useState("#000000");
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

  const eraser = () => {
    setActiveColor("eraser");
    setColor("#ffffff"); // white = erase
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 mb-3">

      {/* 🎨 COLORS */}
      <div className="flex gap-2 mb-4 justify-center">
        {colors.map((c, i) => (
          <button
            key={i}
            onClick={() => handleColor(c)}
            className={`w-7 h-7 rounded-full border-2 transition ${
              activeColor === c
                ? "border-black scale-110"
                : "border-gray-300"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* 🖌 BRUSH SIZE */}
      <div className="flex gap-2 mb-4 justify-center">
        {sizes.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSize(s)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeSize === s
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {s}px
          </button>
        ))}
      </div>

      {/* 🧰 TOOLS */}
      <div className="flex gap-2 justify-center">

        {/* ERASER */}
        <button
          onClick={eraser}
          className={`px-3 py-1 rounded ${
            activeColor === "eraser"
              ? "bg-gray-800 text-white"
              : "bg-gray-200"
          }`}
        >
          Eraser
        </button>

        {/* CLEAR */}
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