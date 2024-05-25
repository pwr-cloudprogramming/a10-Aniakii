const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const app = express();
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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
