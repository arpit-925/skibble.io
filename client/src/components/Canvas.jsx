import { useState } from "react";
import useCanvas from "../hooks/useCanvas";
import Toolbar from "./Toolbar";

export default function Canvas({ roomId, isDrawer }) {
  const [color, setColor] = useState("#111827");
  const [size, setSize] = useState(8);
  const [mode, setMode] = useState("brush");
  const { canvasRef, startDrawing, moveDrawing, stopDrawing, clearCanvas, undo } = useCanvas({
    roomId,
    isDrawer,
    color,
    size,
    mode,
  });

  return (
    <div className="canvas-shell">
      <Toolbar
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        mode={mode}
        setMode={setMode}
        onClear={clearCanvas}
        onUndo={undo}
        disabled={!isDrawer}
      />

      <div className="canvas-board">
        {!isDrawer && <div className="canvas-lock">Only the drawer can draw right now.</div>}
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={moveDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={moveDrawing}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
}
