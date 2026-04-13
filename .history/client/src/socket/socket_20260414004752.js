import { io } from "socket.io-client";

const socket = io("https://skibble-io.onrender.com");

export default socket;