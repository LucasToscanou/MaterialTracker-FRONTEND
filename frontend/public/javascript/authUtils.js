import { backendAddress, tokenKeyword } from './constants.js';
export async function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        return { isAuthenticated: false, username: 'visitante' };
    }
    try {
        const response = await fetch(`${backendAddress}accounts/token-auth/`, {
            method: 'GET',
            headers: {
                'Authorization': `${tokenKeyword}${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            return { isAuthenticated: true, username: data.username };
        }
        else {
            return { isAuthenticated: false, username: 'visitante' };
        }
    }
    catch (error) {
        console.error('Error checking authentication:', error);
        return { isAuthenticated: false, username: 'visitante' };
    }
}
