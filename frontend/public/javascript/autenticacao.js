// Import constants
import { backendAddress, tokenKeyword } from './constants.js';
window.addEventListener('load', () => {
    // Verifica o username e coloca no cabeçalho da página
    const token = localStorage.getItem('token'); // Recupera o token de autenticação
    fetch(backendAddress + 'accounts/token-auth/', {
        method: 'GET',
        headers: {
            'Authorization': tokenKeyword + token // Reenvia o token no cabeçalho HTTP
        }
    })
        .then(response => {
        response.json().then(data => {
            const usuario = data;
            if (response.ok) {
                // token enviado no cabeçalho foi aceito pelo servidor
                let obkUList = document.getElementById('logged');
                obkUList.classList.remove('invisivel');
                obkUList.classList.add('visivel');
                obkUList = document.getElementById('unlogged');
                obkUList.classList.remove('visivel');
                obkUList.classList.add('invisivel');
            }
            else {
                // token enviado no cabeçalho foi rejeitado pelo servidor
                usuario.username = 'visitante';
                let obkUList = document.getElementById('unlogged');
                obkUList.classList.remove('invisivel');
                obkUList.classList.add('visivel');
                obkUList = document.getElementById('logged');
                obkUList.classList.remove('visivel');
                obkUList.classList.add('invisivel');
            }
            const spanElement = document.getElementById('profileName');
            spanElement.innerHTML = usuario.username;
        });
    })
        .catch(erro => {
        console.log('[setLoggedUser] deu erro: ' + erro);
    });
});
