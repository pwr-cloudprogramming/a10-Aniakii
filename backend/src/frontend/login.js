import { signInUser } from './cognito.js';

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    signInUser(username, password, (err, result) => {
        if (err) {
            alert(err.message || JSON.stringify(err));
        } else {
            alert('Login successful!');
            localStorage.setItem('loggedInUser', username);
            window.location.href = 'start.html';
        }
    });
}

window.login = login; 
