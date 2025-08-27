// socket.js
import { io } from "socket.io-client"

const socket = io("https://furniguard9262-production.up.railway.app", {
  withCredentials: true,
  autoConnect: true,
})

export default socket
