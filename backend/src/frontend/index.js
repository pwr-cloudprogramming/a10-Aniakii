const ws = new WebSocket('ws://<EC2_IP>:8080');
// const ws = new WebSocket('ws://localhost:8080');

console.log("COGNITO_USER_POOL_ID:", "<COGNITO_USER_POOL_ID>");
console.log("COGNITO_CLIENT_ID:", "<COGNITO_CLIENT_ID>");

function goToLogIn() {
    window.location.href = 'login.html';
}

function goToRegister() {
    window.location.href = 'register.html';
}