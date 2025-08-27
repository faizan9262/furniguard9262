import { io } from "socket.io-client";
const adminSocket = io("https://furniguard9262-production.up.railway.app", {
  withCredentials: true,
  autoConnect: true,
});

export default adminSocket;
