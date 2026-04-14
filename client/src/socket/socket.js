import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket = io(backendUrl, {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

export { backendUrl };
export default socket;
