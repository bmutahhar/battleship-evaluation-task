import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { connect } from "mongoose";
import { config } from "dotenv";
import bodyParser from "body-parser";
import authRoute from "./routes/auth";
import adminRoute from "./routes/admin";
import cors from "cors";
import morgan from "morgan";
import { initPlayerConnection } from "./multiplayer";

const dbURl: string = "mongodb://localhost:27017/battleship";

const PORT = process.env.PORT || 8080;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
config();
const connection = connect(dbURl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/auth", authRoute);
app.use("/admin", adminRoute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server running successfully!" });
});

connection
  .then(() => {
    console.log("Database Connected Successfully!");
    server.listen(PORT, () => {
      console.log("Server successfully started on PORT ", PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Socket io code
type connection = boolean;
// only 2 connections allowed for now
const connections: connection[] = [false, false];

let pool: number[] = [];

io.on("connection", (socket: Socket) => {
  // Find an available player number
  let playerIndex = -1;
  for (let i = 0; i < connections.length; i++) {
    if (!connections[i]) {
      playerIndex = i;
      connections[i] = true;
      pool.push(playerIndex);
      break;
    }
  }

  // Tell the connecting client what player number they are
  socket.emit("player-number", { playerId: playerIndex, pool: pool });

  console.log(`Player ${playerIndex} has connected`);
  console.log("Pool: ", pool);

  // Ignore player 3
  if (playerIndex === -1) return;

  // Tell eveyone what player number just connected
  socket.broadcast.emit("player-connection", {
    action: "connected",
    playerId: playerIndex,
  });

  // Handle Diconnect
  socket.on("disconnect", () => {
    console.log(`Player ${playerIndex} disconnected`);
    connections[playerIndex] = false;
    pool = pool.filter((item: number) => item != playerIndex);
    console.log("Pool: ", pool);
    //Tell everyone what player number just disconnected
    socket.broadcast.emit("player-connection", {
      action: "disconnected",
      playerId: playerIndex,
    });
  });

  //Fire event
  socket.on("fire", (index: number) => {
    console.log("Shot fired from ", playerIndex);

    socket.broadcast.emit("fire", index);
  });
});
