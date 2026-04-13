import { useEffect } from "react";
import socket from "../socket/socket";

export default function useSocket(event, callback) {
  useEffect(() => {
    // listen to event
    socket.on(event, callback);

    // cleanup
    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
}