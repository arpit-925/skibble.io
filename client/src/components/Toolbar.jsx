const COLORS = ["#111827", "#ef4444", "#2563eb", "#16a34a", "#f59e0b", "#ec4899"];
const SIZES = [4, 8, 14, 22];

export default function Toolbar({ color, setColor, size, setSize, mode, setMode, onClear, onUndo, disabled }) {
  return (
    <div className="toolbar" aria-label="Drawing toolbar">
      <div className="toolbar-group">
        {COLORS.map((item) => (
          <button
            key={item}
            className={`color-swatch ${color === item && mode === "brush" ? "active" : ""}`}
            style={{ backgroundColor: item }}
            onClick={() => {
              setColor(item);
              setMode("brush");
            }}
            disabled={disabled}
            aria-label={`Use ${item}`}
          />
        ))}
      </div>

      <div className="toolbar-group">
        {SIZES.map((item) => (
          <button
            key={item}
            className={`tool-button ${size === item ? "active" : ""}`}
            onClick={() => setSize(item)}
            disabled={disabled}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="toolbar-group">
        <button className={`tool-button ${mode === "eraser" ? "active" : ""}`} onClick={() => setMode("eraser")} disabled={disabled}>
          Eraser
        </button>
        <button className="tool-button" onClick={onUndo} disabled={disabled}>
          Undo
        </button>
        <button className="tool-button danger" onClick={onClear} disabled={disabled}>
          Clear
        </button>
      </div>
    </div>
  );
}
