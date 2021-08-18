import { Socket } from "socket.io";
// Socket io code
type connection = null | boolean;
// only 2 connections allowed for now
const connections: connection[] = [null, null];

let playerIndex: number = -1;

export const initPlayerConnection = (socket: Socket) => {
  setPlayerIndex(socket);
  playerDisconnect(socket);
};

const setPlayerIndex = (socket: Socket) => {
  // Find an available player number
  let playerIndex = -1;
  for (let i = 0; i < connections.length; i++) {
    if (connections[i] === null) {
      playerIndex = i;
      break;
    }
  }

  // Tell the connecting client what player number they are
  socket.emit("player-number", playerIndex);

  console.log(`Player ${playerIndex} has connected`);

  connections[playerIndex] = false;

  // Tell eveyone what player number just connected
  socket.broadcast.emit("player-connection", playerIndex);
};

const playerDisconnect = (socket: Socket) => {
  // Handle Diconnect
  socket.on("disconnect", () => {
    console.log(`Player ${playerIndex} disconnected`);
    connections[playerIndex] = null;
    //Tell everyone what player numbe just disconnected
    socket.broadcast.emit("player-connection", playerIndex);
  });
};
