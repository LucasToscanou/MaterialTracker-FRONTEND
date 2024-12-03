import { backendAddress } from './constants.js';
onload = () => {
    // Register button click event listener
    document.getElementById('btnRegister').addEventListener('click', evento => {
        evento.preventDefault();
        // Get values from input fields
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
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
            password: password,
            password_confirm: confirmPassword
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
            window.location.replace('login.html');
        })
            .catch((erro) => {
            console.log(erro);
        });
        // // Create a User Profile
        // const profile = JSON.stringify({
        //     username: username,
        //     email: email,
        //     project: projects[Math.floor(Math.random() * projects.length)].id,
        //     avatar: ''
        // });
        // // Make the fetch request to the registration endpoint
        // fetch(backendAddress + 'userprofiles/', {
        //     method: 'POST',
        //     body: profile,
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        //     .then((response: Response) => {
        //         if (response.ok) {
        //             return response.json();
        //         } else {
        //             if (response.status == 400) {
        //                 msg.innerHTML = 'Erro ao registrar usuário.';
        //             }
        //             throw new Error('Falha na requisição de registro');
        //         }
        //     })
        //     .then((data: { token: string }) => {
        //         // If registration is successful, store the token and redirect
        //         const token: string = data.token;
        //         localStorage.setItem('token', token);
        //         window.location.replace('login.html');
        //     }).then(() => {
        //         window.location.replace('login.html');
        //     }).catch((erro) => {
        //         console.log(erro);
        // });
    });
};
