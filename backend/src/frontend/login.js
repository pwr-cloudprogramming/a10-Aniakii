// login.js
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const user = await Auth.signIn(username, password);
        console.log('Login successful', user);
        window.location.href = "index.html"; // Przekierowanie na stronę główną po zalogowaniu
    } catch (err) {
        console.error('Error logging in', err);
        alert('Error logging in: ' + err.message);
    }
}
