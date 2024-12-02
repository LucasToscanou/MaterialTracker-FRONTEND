// Import constants
import { backendAddress } from './constants.js';
onload = () => {
    // Register button click event listener
    document.getElementById('btnRegister').addEventListener('click', evento => {
        evento.preventDefault();
        // Get values from input fields
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const msg = document.getElementById('msg');
        // Check if passwords match
        if (password !== confirmPassword) {
            msg.innerHTML = 'As senhas não coincidem.';
            return;
        }
        // Create the request body for registration
        const body = JSON.stringify({
            username: username,
            password: password
        });
        // Make the fetch request to the registration endpoint
        fetch(backendAddress + 'accounts/register/', {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                if (response.status == 400) {
                    msg.innerHTML = 'Erro ao registrar usuário.';
                }
                throw new Error('Falha na requisição de registro');
            }
        })
            .then((data) => {
            // If registration is successful, store the token and redirect
            const token = data.token;
            localStorage.setItem('token', token);
            window.location.replace('registerDone.html');
        })
            .catch((erro) => {
            console.log(erro);
        });
    });
};
