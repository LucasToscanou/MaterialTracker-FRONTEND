import { checkAuthentication } from './authUtils.js';

document.addEventListener("DOMContentLoaded", async () => {
    const { isAuthenticated, username } = await checkAuthentication();

    // Profile elements
    const profileImage = document.getElementById("profileImage") as HTMLImageElement;
    const profileName = document.getElementById("profileName") as HTMLSpanElement;
    const dropdownMenu = document.getElementById("dropdownMenu") as HTMLUListElement;

    // Hero section elements
    const heroSection = document.querySelector(".index-hero-text") as HTMLDivElement;

    if (isAuthenticated) {
        // User is authenticated
        profileImage.src = "../images/generic_user.png";
        profileName.textContent = username;

        dropdownMenu.innerHTML = '';
        const changePasswordItem = document.createElement('li');
        const changePasswordLink = document.createElement('a');
        changePasswordLink.className = 'dropdown-item';
        changePasswordLink.href = '/passwordChange.html';
        changePasswordLink.textContent = 'Change password';
        changePasswordItem.appendChild(changePasswordLink);
        dropdownMenu.appendChild(changePasswordItem);

        const divider = document.createElement('hr');
        divider.className = 'dropdown-divider';
        dropdownMenu.appendChild(divider);

        const signOutItem = document.createElement('li');
        const signOutLink = document.createElement('a');
        signOutLink.className = 'dropdown-item';
        signOutLink.href = '/logout.html';
        signOutLink.textContent = 'Sign out';
        signOutItem.appendChild(signOutLink);
        dropdownMenu.appendChild(signOutItem);

        heroSection.innerHTML = '';
        const heroTitle = document.createElement('h1');
        heroTitle.className = 'display-1 fw-bolder text-body-emphasis';
        heroTitle.textContent = 'Material Tracker';
        heroSection.appendChild(heroTitle);

        const heroContent = document.createElement('div');
        heroContent.className = 'col-lg-6 mx-auto';
        heroSection.appendChild(heroContent);

        const heroSubtitle = document.createElement('p');
        heroSubtitle.className = 'display-5 fw-bold mb-4 text-body-emphasis';
        heroSubtitle.textContent = 'Store, Find, Book';
        heroContent.appendChild(heroSubtitle);

        const heroButtonContainer = document.createElement('div');
        heroButtonContainer.className = 'd-grid gap-2 d-sm-flex justify-content-sm-center';
        heroContent.appendChild(heroButtonContainer);

        const inventoryLink = document.createElement('a');
        inventoryLink.href = 'inventory.html';
        heroButtonContainer.appendChild(inventoryLink);

        const inventoryButton = document.createElement('button');
        inventoryButton.type = 'button';
        inventoryButton.className = 'btn btn-primary btn-lg px-4';
        inventoryButton.textContent = 'Go to inventory';
        inventoryLink.appendChild(inventoryButton);
    } else {
        // User is not authenticated
        profileImage.src = "../images/generic_user.png";
        profileName.textContent = "";

        dropdownMenu.innerHTML = '';
        const signInItem = document.createElement('li');
        const signInLink = document.createElement('a');
        signInLink.className = 'dropdown-item';
        signInLink.href = 'login.html';
        signInLink.textContent = 'Sign in';
        signInItem.appendChild(signInLink);
        dropdownMenu.appendChild(signInItem);

        const registerItem = document.createElement('li');
        const registerLink = document.createElement('a');
        registerLink.className = 'dropdown-item';
        registerLink.href = 'register.html';
        registerLink.textContent = 'Register';
        registerItem.appendChild(registerLink);
        dropdownMenu.appendChild(registerItem);

        heroSection.innerHTML = '';
        const heroTitle = document.createElement('h1');
        heroTitle.className = 'display-1 fw-bolder text-body-emphasis';
        heroTitle.textContent = 'Material Tracker';
        heroSection.appendChild(heroTitle);

        const heroContent = document.createElement('div');
        heroContent.className = 'col-lg-6 mx-auto';
        heroSection.appendChild(heroContent);

        const heroSubtitle = document.createElement('p');
        heroSubtitle.className = 'display-5 fw-bold mb-4 text-body-emphasis';
        heroSubtitle.textContent = 'Store, Find, Book';
        heroContent.appendChild(heroSubtitle);

        const heroButtonContainer = document.createElement('div');
        heroButtonContainer.className = 'd-grid gap-2 d-sm-flex justify-content-sm-center';
        heroContent.appendChild(heroButtonContainer);

        const loginLink = document.createElement('a');
        loginLink.href = '/login.html';
        heroButtonContainer.appendChild(loginLink);

        const loginButton = document.createElement('button');
        loginButton.type = 'button';
        loginButton.className = 'btn btn-primary btn-lg px-4';
        loginButton.textContent = 'Sign in';
        loginLink.appendChild(loginButton);
    }
});