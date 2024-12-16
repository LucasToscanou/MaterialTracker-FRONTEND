// Import constants
import { backendAddress } from './constants.js';
import { checkAuthentication } from './authUtils.js';
const columns = ["Name", "Email"];
const initializePage = async () => {
    const { isAuthenticated, username } = await checkAuthentication();
    if (isAuthenticated) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(backendAddress + "project/current/", {
                method: "GET",
                headers: {
                    "Authorization": `Token ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch current project");
            }
            const project = await response.json();
            document.getElementById("project-name").textContent = project.name;
        }
        catch (error) {
            console.error("Error fetching current project:", error);
        }
    }
    fillHeader();
    populateColumns();
};
// Call initializePage when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializePage);
const populateColumns = () => {
    const columnsRow = document.getElementById("columns-row");
    columns.forEach((col) => {
        const th = document.createElement("th");
        const dropdown = document.createElement("div");
        dropdown.className = "dropdown text-end";
        const link = document.createElement("a");
        link.href = "#";
        link.className = "d-block link-body-emphasis text-decoration-none dropdown-toggle d-flex align-items-center";
        link.setAttribute("data-bs-toggle", "dropdown");
        link.setAttribute("aria-expanded", "false");
        link.innerHTML = `<span>${col}</span>`;
        dropdown.appendChild(link);
        const dropdownMenu = document.createElement("ul");
        dropdownMenu.className = "dropdown-menu text-small";
        const sortAsc = document.createElement("li");
        const sortAscLink = document.createElement("a");
        sortAscLink.className = "dropdown-item";
        sortAscLink.href = "#";
        sortAscLink.textContent = "Sort Ascending";
        sortAsc.appendChild(sortAscLink);
        dropdownMenu.appendChild(sortAsc);
        const sortDesc = document.createElement("li");
        const sortDescLink = document.createElement("a");
        sortDescLink.className = "dropdown-item";
        sortDescLink.href = "#";
        sortDescLink.textContent = "Sort Descending";
        sortDesc.appendChild(sortDescLink);
        dropdownMenu.appendChild(sortDesc);
        const divider = document.createElement("li");
        const hr = document.createElement("hr");
        hr.className = "dropdown-divider";
        divider.appendChild(hr);
        dropdownMenu.appendChild(divider);
        const filterItem = document.createElement("li");
        const filterForm = document.createElement("form");
        filterForm.className = "dropdown-item d-flex align-items-center";
        const filterInput = document.createElement("input");
        filterInput.type = "text";
        filterInput.className = "form-control me-2";
        filterInput.placeholder = "Filter";
        const filterButton = document.createElement("button");
        filterButton.type = "submit";
        filterButton.className = "btn btn-primary";
        filterButton.textContent = "Filter";
        filterForm.appendChild(filterInput);
        filterForm.appendChild(filterButton);
        filterItem.appendChild(filterForm);
        dropdownMenu.appendChild(filterItem);
        dropdown.appendChild(dropdownMenu);
        th.appendChild(dropdown);
        columnsRow.appendChild(th);
    });
};
async function fillHeader() {
    const { isAuthenticated, username } = await checkAuthentication();
    // Profile elements
    const profileImage = document.getElementById("profileImage");
    const profileName = document.getElementById("profileName");
    const dropdownMenu = document.getElementById("dropdownMenu");
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
    }
    else {
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
    }
}
const populatePeople = async () => {
    const peopleTbody = document.getElementById("people-tbody");
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(backendAddress + "userprofiles/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch people");
        }
        const people = await response.json();
        people.forEach((person) => {
            const row = document.createElement("tr");
            const idCell = document.createElement("td");
            idCell.textContent = person.id.toString();
            row.appendChild(idCell);
            const usernameCell = document.createElement("td");
            usernameCell.textContent = person.username;
            row.appendChild(usernameCell);
            const emailCell = document.createElement("td");
            emailCell.textContent = person.email;
            row.appendChild(emailCell);
            peopleTbody.appendChild(row);
        });
    }
    catch (error) {
        console.error("Error populating people:", error);
    }
    try {
        const response = await fetch(backendAddress + "projects/people/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch people");
        }
        const people = await response.json();
        people.forEach((person) => {
            const row = document.createElement("tr");
            const idCell = document.createElement("td");
            idCell.textContent = person.id.toString();
            row.appendChild(idCell);
            const usernameCell = document.createElement("td");
            usernameCell.textContent = person.username;
            row.appendChild(usernameCell);
            const emailCell = document.createElement("td");
            emailCell.textContent = person.email;
            row.appendChild(emailCell);
            peopleTbody.appendChild(row);
        });
    }
    catch (error) {
        console.error("Error populating people:", error);
    }
};
// Call populatePeople when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", populatePeople);
