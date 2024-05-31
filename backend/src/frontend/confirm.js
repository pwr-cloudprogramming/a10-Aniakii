import { confirmUser } from './cognito.js';

function confirm() {
    const username = document.getElementById('username').value;
    const code = document.getElementById('code').value;

    confirmUser(username, code, (err, result) => {
        if (err) {
            alert(err.message || JSON.stringify(err));
        } else {
            alert('Confirm successful!');
            // localStorage.setItem('loggedInUser', username);
            window.location.href = 'login.html';
        }
    });
}


window.confirm = confirm; 
