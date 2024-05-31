const ws = new WebSocket("ws://" + BACKEND_URL + ":8080");
// const ws = new WebSocket('ws://localhost:8080');

function goToLogIn() {
  window.location.href = "login.html";
}

function goToRegister() {
  window.location.href = "register.html";
}

