import { useEffect, useRef } from "react";
import socket from "../socket/socket";

export default function useSocket(event, handler) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (data) => {
      savedHandler.current?.(data);
    };

    socket.on(event, listener);
    return () => socket.off(event, listener);
  }, [event]);
}