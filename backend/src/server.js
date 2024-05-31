const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const ejs = require("ejs");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "frontend"));

const server = http.createServer(app);
const wss = new WebSocket.Server({
  server,
  clientTracking: true,
  followRedirects: true,
});

let players = [];

app.use(express.static("./frontend"));

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);

    const parsedMessage = JSON.parse(message);
    const messageType = parsedMessage.type;
    const messageContent = parsedMessage.content;

    switch (messageType) {
      case "username":
        console.log("Received username message:", messageContent);
        players.push(messageContent);

        break;
      case "turn":
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "turnGame",
                content: messageContent,
              }),
            );
          }
        });
        break;
      default:
        console.log("Unknown message type");
        break;
    }

    if (players.length >= 2) {
      createGame();
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    players = [];
  });
});

function createGame() {
  let p1obj = {
    name: players[0],
    value: "X",
    move: "",
  };
  let p2obj = {
    name: players[1],
    value: "O",
    move: "",
  };
  let game = {
    p1: p1obj,
    p2: p2obj,
  };
  players.splice(0, 2);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const message = {
        type: "game",
        content: JSON.stringify(game),
      };
      client.send(JSON.stringify(message));
    }
  });
}

app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend", "game.html"));
});

app.get("/config.js", (req, res) => {
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
  const COGNITO_USER_POOL_ID =
    process.env.COGNITO_USER_POOL_ID || "default_pool_id";
  const COGNITO_CLIENT_ID =
    process.env.COGNITO_CLIENT_ID || "default_client_id";
  res.setHeader("Content-Type", "application/javascript");
  res.render("config.js.ejs", {
    BACKEND_URL,
    COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_ID,
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
