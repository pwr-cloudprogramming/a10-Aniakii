import { signOutUser } from './cognito.js';

const ws = new WebSocket("ws://" + BACKEND_URL + ":8080");

function goToLogIn() {
  window.location.href = "login.html";
}

function goToRegister() {
  window.location.href = "register.html";
}

function logOut() {
  signOutUser((err, result) => {
    if (err) {
      alert(err.message || JSON.stringify(err));
    } else {
      alert('Log out successful!');
    }
  });
}

window.goToLogIn = goToLogIn;
window.goToRegister = goToRegister;
window.logOut = logOut;
