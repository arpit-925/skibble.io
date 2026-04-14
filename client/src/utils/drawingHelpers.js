export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 640;

export function getCanvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const source = event.touches?.[0] || event.changedTouches?.[0] || event;

  return {
    x: ((source.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
    y: ((source.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
  };
}

export function setupCanvasContext(canvas) {
  const context = canvas.getContext("2d");
  context.lineCap = "round";
  context.lineJoin = "round";
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  return context;
}

export function drawStrokeSegment(context, from, to, options) {
  context.save();
  context.globalCompositeOperation = options.mode === "eraser" ? "destination-out" : "source-over";
  context.strokeStyle = options.color;
  context.lineWidth = options.size;
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(to.x, to.y);
  context.stroke();
  context.restore();
}

export function replayStrokes(context, strokes) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  strokes.forEach((stroke) => {
    for (let index = 1; index < stroke.points.length; index += 1) {
      drawStrokeSegment(context, stroke.points[index - 1], stroke.points[index], stroke);
    }
  });
}
