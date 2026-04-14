import React, { useRef, useEffect, useState } from 'react';

const Canvas = ({ socket, roomId, isDrawer }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
    context.lineWidth = 5;
    setCtx(context);

    // Listen for incoming drawing data
    socket.on('draw_start', ({ x, y, color, size }) => {
      context.beginPath();
      context.moveTo(x, y);
      context.strokeStyle = color;
      context.lineWidth = size;
    });

    socket.on('draw_move', ({ x, y }) => {
      context.lineTo(x, y);
      context.stroke();
    });

    socket.on('canvas_clear', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });
  }, [socket]);

  const startDrawing = (e) => {
    if (!isDrawer) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socket.emit('draw_start', { roomId, x: offsetX, y: offsetY, color: ctx.strokeStyle, size: ctx.lineWidth });
  };

  const draw = (e) => {
    if (!isDrawing || !isDrawer) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    socket.emit('draw_move', { roomId, x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      className="bg-white border-4 border-gray-800 rounded-lg shadow-xl cursor-crosshair"
    />
  );
};

export default Canvas;