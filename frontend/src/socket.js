import { io } from "socket.io-client";

// const socket = io("http://10.42.0.1:5174"); // or your LAN IP

const socket = io("http://10.50.4.159:5174"); // or your LAN IP

export default socket;