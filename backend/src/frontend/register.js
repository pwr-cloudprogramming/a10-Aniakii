// // register.js
// import Amplify, { Auth } from 'aws-amplify';
// import awsconfig from './aws-exports';

// Amplify.configure(awsconfig);

// async function register() {
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;
//     const email = document.getElementById('email').value;

//     try {
//         const { user } = await Auth.signUp({
//             username,
//             password,
//             attributes: {
//                 email,
//             }
//         });
//         console.log('Registration successful', user);
//         alert('Registration successful! Please check your email to confirm your account.');
//         window.location.href = "login.html"; // Przekierowanie do strony logowania po rejestracji
//     } catch (err) {
//         console.error('Error registering', err);
//         alert('Error registering: ' + err.message);
//     }
// }


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
            window.location.href = 'login.html'; // Redirect to the login page
        }
    });
}

window.register = register; // Ensure the function is accessible in the HTML
