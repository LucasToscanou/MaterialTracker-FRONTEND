// Import constants
import { backendAddress, UserProfile } from './constants.js';
import { checkAuthentication } from './authUtils.js';


const columns: string[] = ["Name", "Email"];


const initializePage = async (): Promise<void> => {
    const { isAuthenticated, username } = await checkAuthentication();
    if (isAuthenticated) {
        const token = localStorage.getItem("token");
        fetch(backendAddress + "project/current/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch current project");
                }
                return response.json();
            })
            .then((project: { name: string }) => {
                document.getElementById("project-name")!.textContent = project.name;
            })
            .catch((error) => {
                console.error("Error fetching current project:", error);
            });
    }
    fillHeader();
    populateColumns();

};

// Call initializePage when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializePage);



const populateColumns = (): void => {
    const columnsRow = document.getElementById("columns-row")!;
    columns.forEach((col) => {
        const th = document.createElement("th");
        th.innerHTML = `
        <div class="dropdown text-end">
          <a href="#" class="d-block link-body-emphasis text-decoration-none dropdown-toggle d-flex align-items-center"
            data-bs-toggle="dropdown" aria-expanded="false">
            <span>${col}</span>
          </a>
          <ul class="dropdown-menu text-small">
            <li><a class="dropdown-item" href="#">Sort Ascending</a></li>
            <li><a class="dropdown-item" href="#">Sort Descending</a></li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <form class="dropdown-item d-flex align-items-center">
                <input type="text" class="form-control me-2" placeholder="Filter">
                <button type="submit" class="btn btn-primary">Filter</button>
              </form>
            </li>
          </ul>
        </div>`;
        columnsRow.appendChild(th);
    });
};


async function fillHeader() {
    const { isAuthenticated, username } = await checkAuthentication();

    // Profile elements
    const profileImage = document.getElementById("profileImage") as HTMLImageElement;
    const profileName = document.getElementById("profileName") as HTMLSpanElement;
    const dropdownMenu = document.getElementById("dropdownMenu") as HTMLUListElement;

    if (isAuthenticated) {
        // User is authenticated
        profileImage.src = "../images/generic_user.png";
        profileName.textContent = username;

        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="/passwordChange.html">Change password</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="/logout.html">Sign out</a></li>
        `;
    } else {
        // User is not authenticated
        profileImage.src = "../images/generic_user.png";
        profileName.textContent = "";

        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="/login.html">Sign in</a></li>
            <li><a class="dropdown-item" href="/register.html">Register</a></li>
        `;
    }
}

const populatePeople = async (): Promise<void> => {
    const peopleTbody = document.getElementById("people-tbody")!;
    const token = localStorage.getItem("token");

    fetch(backendAddress + `${backendAddress}userprofiles/${user_id}/`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch people");
            }
            return response.json();
        })
        .then((people: { id: number, username: string, email: string }[]) => {
            people.forEach((person) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${person.id}</td>
                    <td>${person.username}</td>
                    <td>${person.email}</td>`;
                peopleTbody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error populating people:", error);
        });

    fetch(backendAddress + `${backendAddress}projects/people/${user_project}/`, {
        method: "GET",
        headers: {
            "Authorization": `Token ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch people");
            }
            return response.json();
        })
        .then((people: { id: number, username: string, email: string }[]) => {
            people.forEach((person) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${person.id}</td>
                    <td>${person.username}</td>
                    <td>${person.email}</td>`;
                peopleTbody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error populating people:", error);
        });
};

// Call populatePeople when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", populatePeople);