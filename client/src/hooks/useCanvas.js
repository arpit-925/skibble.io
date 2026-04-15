import { useCallback, useEffect, useRef, useState } from "react";
import socket from "../socket/socket";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  drawStrokeSegment,
  getCanvasPoint,
  replayStrokes,
  setupCanvasContext,
} from "../utils/drawingHelpers";

export default function useCanvas({ roomId, isDrawer, color, size, mode }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const strokesRef = useRef([]);
  const activeStrokeRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    contextRef.current = setupCanvasContext(canvas);
    return undefined;
  }, []);

  const drawRemotePoint = useCallback((point, options) => {
    const active = activeStrokeRef.current;
    if (!contextRef.current || !active) return;
    const previous = active.points[active.points.length - 1];
    active.points.push(point);
    drawStrokeSegment(contextRef.current, previous, point, options);
  }, []);

  useEffect(() => {
    const handleStart = ({ point, color: remoteColor, size: remoteSize, mode: remoteMode, socketId }) => {
      if (socketId === socket.id) return;

      activeStrokeRef.current = {
        color: remoteColor,
        size: remoteSize,
        mode: remoteMode,
        points: [point],
      };
    };

    const handleMove = ({ point, color: remoteColor, size: remoteSize, mode: remoteMode, socketId }) => {
      if (socketId === socket.id) return;

      drawRemotePoint(point, {
        color: remoteColor,
        size: remoteSize,
        mode: remoteMode,
      });
    };

    const handleEnd = ({ socketId } = {}) => {
      if (socketId === socket.id) return;

      if (activeStrokeRef.current) strokesRef.current.push(activeStrokeRef.current);
      activeStrokeRef.current = null;
    };

    const handleClear = ({ socketId } = {}) => {
      if (socketId === socket.id) return;

      strokesRef.current = [];
      activeStrokeRef.current = null;
      if (contextRef.current) replayStrokes(contextRef.current, []);
    };

    const handleUndo = ({ socketId } = {}) => {
      if (socketId === socket.id) return;

      strokesRef.current = strokesRef.current.slice(0, -1);
      if (contextRef.current) replayStrokes(contextRef.current, strokesRef.current);
    };

    socket.on("draw_start", handleStart);
    socket.on("draw_move", handleMove);
    socket.on("draw_end", handleEnd);
    socket.on("canvas_clear", handleClear);
    socket.on("draw_undo", handleUndo);

    return () => {
      socket.off("draw_start", handleStart);
      socket.off("draw_move", handleMove);
      socket.off("draw_end", handleEnd);
      socket.off("canvas_clear", handleClear);
      socket.off("draw_undo", handleUndo);
    };
  }, [drawRemotePoint]);

  const startDrawing = (event) => {
    if (!isDrawer || !contextRef.current) return;
    event.preventDefault();
    const point = getCanvasPoint(event, canvasRef.current);
    activeStrokeRef.current = { color, size, mode, points: [point] };
    setIsDrawing(true);
    socket.emit("draw_start", { roomId, point, color, size, mode });
  };

  const moveDrawing = (event) => {
    if (!isDrawer || !isDrawing || !activeStrokeRef.current || !contextRef.current) return;
    event.preventDefault();
    const point = getCanvasPoint(event, canvasRef.current);
    const previous = activeStrokeRef.current.points[activeStrokeRef.current.points.length - 1];
    activeStrokeRef.current.points.push(point);
    drawStrokeSegment(contextRef.current, previous, point, { color, size, mode });
    socket.emit("draw_move", { roomId, point, color, size, mode });
  };

  const stopDrawing = () => {
    if (!isDrawer || !activeStrokeRef.current) return;
    strokesRef.current.push(activeStrokeRef.current);
    activeStrokeRef.current = null;
    setIsDrawing(false);
    socket.emit("draw_end", { roomId });
  };

  const clearCanvas = () => {
    if (!isDrawer) return;
    strokesRef.current = [];
    if (contextRef.current) replayStrokes(contextRef.current, []);
    socket.emit("canvas_clear", { roomId });
  };

  const undo = () => {
    if (!isDrawer) return;
    strokesRef.current = strokesRef.current.slice(0, -1);
    if (contextRef.current) replayStrokes(contextRef.current, strokesRef.current);
    socket.emit("draw_undo", { roomId });
  };

  return {
    canvasRef,
    startDrawing,
    moveDrawing,
    stopDrawing,
    clearCanvas,
    undo,
  };
}
