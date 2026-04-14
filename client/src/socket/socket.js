import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://skibble-io.onrender.com";

const socket = io(backendUrl, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  withCredentials: true,
  timeout: 10000,
});

export { backendUrl };
export default socket;
