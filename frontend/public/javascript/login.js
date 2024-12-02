// Import constants
import { backendAddress } from './constants.js';
onload = () => {
    document.getElementById('btnLogin').addEventListener('click', evento => {
        evento.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const msg = document.getElementById('msg');
        fetch(backendAddress + 'accounts/token-auth/', {
            method: 'POST',
            body: JSON.stringify({
                'username': username,
                'password': password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                if (response.status == 401) {
                    msg.innerHTML = 'Usuário ou senha inválidos.';
                }
                throw new Error('Falha na autenticação');
            }
        }).then((data) => {
            const token = data.token;
            localStorage.setItem('token', token);
            window.location.replace('/');
        }).catch(erro => { console.log(erro); });
    });
};
