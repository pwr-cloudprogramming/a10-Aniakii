// const ws = new WebSocket('ws://<EC2_IP>:8080');
const ws = new WebSocket('ws://localhost:8080');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const gameObjectString = urlParams.get("game");
const clientsName = urlParams.get("player");
const gameObject = JSON.parse(gameObjectString);

const player =
  gameObject["p1"]["name"] === clientsName
    ? gameObject["p1"]
    : gameObject["p2"];
const opponent =
  gameObject["p1"]["name"] !== clientsName
    ? gameObject["p1"]
    : gameObject["p2"];

let turn = player["value"] === "X" ? player : opponent;

const tiles = document.querySelectorAll(".tile");

const boardState = Array(tiles.length);

const players1Name = document.getElementById("p1Name");
const players2Name = document.getElementById("p2Name");

const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");

players1Name.innerText = `You:  ${player["name"]}`;
players2Name.innerText = `Opponent:  ${opponent["name"]}`;
boardState.fill(null);
tiles.forEach((tile) => tile.addEventListener("click", tileClick));
setHoverText();

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === "turnGame") {
    const content = JSON.parse(message.content);

    const tileNumber = content["tile"];
    const value = content["value"];

    const tile = document.querySelector(`[data-index="${tileNumber}"]`);
    tile.innerText = value;
    boardState[tileNumber - 1] = value;
    turn = player["value"] === value ? opponent : player;

    setHoverText();
    checkWinner();
  }
};

function startNewGame() {
  strike.className = "strike";
  gameOverArea.className = "hidden";
  boardState.fill(null);
  tiles.forEach((tile) => (tile.innerText = ""));
  turn = player["value"] === "X" ? player : opponent;
  setHoverText();
}

function setHoverText() {
  tiles.forEach((tile) => {
    tile.classList.remove("x-hover");
    tile.classList.remove("o-hover");
  });

  if (gameOverArea.classList.contains("visible") || turn == opponent) {
    return;
  }
  const hoverClass = `${turn["value"].toLowerCase()}-hover`;

  tiles.forEach((tile) => {
    if (tile.innerText == "") {
      tile.classList.add(hoverClass);
    }
  });
}

function tileClick(event) {
  if (gameOverArea.classList.contains("visible") || turn == opponent) {
    return;
  }

  const tile = event.target;
  const tileNumber = tile.dataset.index;
  if (tile.innerText != "") {
    return;
  }

  const message = {
    type: "turn",
    content: JSON.stringify({ tile: tileNumber, value: turn["value"] }),
  };
  ws.send(JSON.stringify(message));
}

function updateState() { }

function checkWinner() {
  for (const winningCombination of winningCombinations) {
    const { combo, strikeClass } = winningCombination;
    const tileValue1 = boardState[combo[0] - 1];
    const tileValue2 = boardState[combo[1] - 1];
    const tileValue3 = boardState[combo[2] - 1];

    if (
      tileValue1 != null &&
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      strike.classList.add(strikeClass);
      if (tileValue1 === "X") {
        gameOverScreen("X");
      } else {
        gameOverScreen("Y");
      }

      return;
    }
  }

  const allTileFilledIn = boardState.every((tile) => tile !== null);
  if (allTileFilledIn) {
    gameOverScreen(null);
  }
}

function gameOverScreen(winnerText) {
  let text = "Draw!";
  if (winnerText != null) {
    if (winnerText === player["value"]) {
      text = `You won, congrats!`;
    } else {
      text = `You lost! :(`;
    }
  }
  gameOverArea.className = "visible";
  gameOverText.innerText = text;
  playAgain.addEventListener("click", startNewGame);
}

const winningCombinations = [
  //rows
  { combo: [1, 2, 3], strikeClass: "strike-row-1" },
  { combo: [4, 5, 6], strikeClass: "strike-row-2" },
  { combo: [7, 8, 9], strikeClass: "strike-row-3" },
  //columns
  { combo: [1, 4, 7], strikeClass: "strike-column-1" },
  { combo: [2, 5, 8], strikeClass: "strike-column-2" },
  { combo: [3, 6, 9], strikeClass: "strike-column-3" },
  //diagonals
  { combo: [1, 5, 9], strikeClass: "strike-diagonal-1" },
  { combo: [3, 5, 7], strikeClass: "strike-diagonal-2" },
];
