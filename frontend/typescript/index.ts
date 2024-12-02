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
        profileImage.src = "/path/to/profile/photo.jpg";
        profileName.textContent = username;

        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="/passwordChange.html">Change password</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="/logout.html">Sign out</a></li>
        `;

        heroSection.innerHTML = `
            <h1 class="display-1 fw-bolder text-body-emphasis">Material Tracker</h1>
            <div class="col-lg-6 mx-auto">
                <p class="display-5 fw-bold mb-4 text-body-emphasis">Store, Find, Book</p>
                <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <a href="inventory.html">
                        <button type="button" class="btn btn-primary btn-lg px-4">Go to inventory</button>
                    </a>
                </div>
            </div>
        `;
    } else {
        // User is not authenticated
        profileImage.src = "../images/generic_user.png";
        profileName.textContent = "";

        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="/login.html">Sign in</a></li>
            <li><a class="dropdown-item" href="/register.html">Register</a></li>
        `;

        heroSection.innerHTML = `
            <h1 class="display-1 fw-bolder text-body-emphasis">Material Tracker</h1>
            <div class="col-lg-6 mx-auto">
                <p class="display-5 fw-bold mb-4 text-body-emphasis">Store, Find, Book</p>
                <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <a href="/login.html">
                        <button type="button" class="btn btn-primary btn-lg px-4">Sign in</button>
                    </a>
                </div>
            </div>
        `;
    }
});
