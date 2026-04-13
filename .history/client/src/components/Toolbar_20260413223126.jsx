import { useState } from "react";
import socket from "../socket/socket";

export default function Toolbar({ roomId, setColor, setSize }) {
  const [activeColor, setActiveColor] = useState("black");
  const [activeSize, setActiveSize] = useState(2);

  const colors = [
    "black",
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange"
  ];

  const sizes = [2, 5, 10];

  const handleColor = (color) => {
    setActiveColor(color);
    setColor(color);
  };

  const handleSize = (size) => {
    setActiveSize(size);
    setSize(size);
  };

  const clearCanvas = () => {
    socket.emit("canvas_clear", { roomId });
  };

  const undo = () => {
    socket.emit("draw_undo", { roomId });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-3">
      
      {/* Colors */}
      <div className="mb-3">
        <h4 className="text-sm font-semibold mb-2">🎨 Colors</h4>
        <div className="flex gap-2 flex-wrap">
          {colors.map((c, i) => (
            <button
              key={i}
              onClick={() => handleColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${
                activeColor === c ? "border-black scale-110" : "border-gray-300"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Brush Sizes */}
      <div className="mb-3">
        <h4 className="text-sm font-semibold mb-2">🖌 Brush Size</h4>
        <div className="flex gap-2">
          {sizes.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSize(s)}
              className={`px-3 py-1 rounded border ${
                activeSize === s
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={undo}
          className="flex-1 bg-yellow-400 text-white p-2 rounded hover:bg-yellow-500"
        >
          Undo
        </button>
        <button
          onClick={clearCanvas}
          className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>

    </div>
  );
}