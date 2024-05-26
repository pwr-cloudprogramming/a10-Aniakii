import { signUpUser } from './cognito.js';

function register() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    signUpUser(username, email, password, (err, result) => {
        if (err) {
            alert(err.message || JSON.stringify(err));
        } else {
            alert('Registration successful! Please check your email to confirm your account.');
            window.location.href = 'login.html';
        }
    });
}

window.register = register; 
