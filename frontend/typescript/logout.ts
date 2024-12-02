import { backendAddress, tokenKeyword } from './constants.js';

onload = () => {
    (document.getElementById('logout') as HTMLInputElement).addEventListener('click', () => {
        const token = localStorage.getItem('token');
        fetch(backendAddress + 'accounts/token-auth/', {
            method: 'DELETE',
            headers: {
                'Authorization': tokenKeyword + token,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const mensagem = document.getElementById('mensagem') as HTMLDivElement;
                if (response.ok) window.location.assign('/');
                else mensagem.innerHTML = 'Erro ' + response.status;
            })
            .catch(erro => { console.log(erro); })
    });
}