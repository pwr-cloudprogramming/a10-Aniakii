// const ws = new WebSocket('ws://<EC2_IP>:8080');
const ws = new WebSocket('ws://localhost:8080');

var nameVal = "";

function startGame() {
  const playerName = document.getElementById("playerName").value;
  if (playerName) {
    nameVal = playerName;
    document.getElementById("loadingArea").className = "visible";
    sendMessage("window", window.location.href);
    sendMessage("username", playerName);
  } else {
    alert("Please enter your name!");
  }
}

function sendMessage(type, content) {
  const message = {
    type: type,
    content: content,
  };
  ws.send(JSON.stringify(message));
}

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === "game") {
    window.location.href = `/game?player=${nameVal}&game=${message.content}`;
  }
};

