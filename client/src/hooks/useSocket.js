import { useEffect, useRef } from "react";
import socket from "../socket/socket";

export default function useSocket(event, handler) {
  const savedHandler = useRef();

  // Store latest handler (prevents stale closure)
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (data) => {
      if (savedHandler.current) {
        savedHandler.current(data);
      }
    };

    socket.on(event, eventListener);

    return () => {
      socket.off(event, eventListener);
    };
  }, [event]);
}