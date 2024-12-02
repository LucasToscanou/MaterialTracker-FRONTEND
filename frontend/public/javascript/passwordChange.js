// Import constants
import { backendAddress, tokenKeyword } from './constants.js';
window.addEventListener('load', () => {
    document.getElementById('formulario').addEventListener('submit', async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        fetch(backendAddress + 'accounts/token-auth/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': tokenKeyword + token,
            },
            body: JSON.stringify({
                old_password: document.getElementById('old_password').value,
                new_password1: document.getElementById('new_password1').value,
                new_password2: document.getElementById('new_password2').value,
            }),
        })
            .then((response) => {
            if (response.ok) {
                // Successful response, handle accordingly
                console.log('Senha trocada com sucesso!');
                return response.json();
            }
            else {
                // Error response, handle accordingly
                console.error('Erro ao trocar a senha: ' + response);
                throw new Error('Erro ao trocar a senha: ' + response);
            }
        })
            .then((data) => {
            const token = data.token;
            localStorage.setItem('token', token);
            //setLoggedUser();
            // 3 opções possíveis (e testadas)
            window.location.replace('passwordChangeDone.html');
        })
            .catch(error => {
            // Network error or other exception
            console.error('Ocorreu um erro:', error);
        });
    });
});
