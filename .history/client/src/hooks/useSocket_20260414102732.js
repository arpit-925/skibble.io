import { useEffect, useRef } from "react";
import socket from "../socket/socket";

export default function useSocket(event, handler) {
  const saved = useRef();

  useEffect(() => {
    saved.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (data) => saved.current?.(data);
    socket.on(event, listener);
    return () => socket.off(event, listener);
  }, [event]);
}