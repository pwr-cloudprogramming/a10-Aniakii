// const ws = new WebSocket('ws://<EC2_IP>:8080');
const ws = new WebSocket('ws://localhost:8080');

var nameVal = "";

function updateSignedInUsername(userName) {
  document.getElementById("signedInUsername").innerText = userName ? `You are logged in as: ${userName}` : "";
}

function initializePage() {
  nameVal = localStorage.getItem('loggedInUser');
  if (nameVal) {
    updateSignedInUsername(nameVal);
  }
}

window.onload = initializePage;

function startGame() {
  if (nameVal) {
    document.getElementById("loadingArea").className = "visible";
    sendMessage("window", window.location.href);
    sendMessage("username", nameVal);
  } else {
    alert("You have to log in first!");
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

