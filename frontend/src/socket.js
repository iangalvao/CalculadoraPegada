import { io } from "socket.io-client";

const socket = io("http://localhost:5174"); // or your LAN IP

export default socket;