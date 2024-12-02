// Import constants
import { backendAddress } from './constants.js';
import { checkAuthentication } from './authUtils.js';
import { clearSelection, updateSelectedCount, requestSelection, editSelection, deleteSelection } from './inventoryOperations.js';

// // Example Data
const columns: string[] = ["Ref", "Description", "Capacity", "Project", "Current Location", "Quality Exp Date", "Cost"];


// Define Material type
type Material = {
    id: number;
    mainImg: string;
    ref: string;
    description: string;
    capacity: string;
    project: string;
    currentLocation: string;
    qualityExpDate: string;
    cost: string;
    currency: string;
};

// Initialize page
const initializePage = (): void => {
    fillHeader();
    populateColumns();

    populateMaterials();
    handleTableActions();
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


// Populate materials table
const populateMaterials = (): void => {
    const materialsTbody = document.getElementById("materials-tbody")!;
    const token = localStorage.getItem("token");

    fetch(backendAddress + "material/list/", {
        method: "GET",
        headers: {
            "Authorization": `Token ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch materials");
            }
            return response.json();
        })
        .then((materials: Material[]) => {
            materials.forEach((material) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>
                        <input type="checkbox" class="checkbox" value="${material.id}">
                    </td>
                    <td>
                        <img src="${material.mainImg}" class="border rounded" style="height: 100px;" alt="Material Image">
                    </td>
                    <td>${material.ref}</td>
                    <td>${material.description}</td>
                    <td>${material.capacity}</td>
                    <td>${material.project}</td>
                    <td>${material.currentLocation}</td>
                    <td>${material.qualityExpDate}</td>
                    <td>${material.cost} ${material.currency}</td>
                    <td>
                        <button class="btn btn-secondary" data-action="edit" data-id="${material.id}">Edit</button>
                        <button class="btn btn-secondary" data-action="request" data-id="${material.id}">Request</button>
                        <button class="btn btn-secondary" data-action="delete" data-id="${material.id}">Delete</button>
                    </td>`;
                materialsTbody.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error populating materials:", error);
        });
};

const reloadMaterialsTable = (): void => {
    const materialsTbody = document.getElementById("materials-tbody")!;
    materialsTbody.innerHTML = ""; // Clear the current table contents
    populateMaterials(); // Repopulate the table
};

// Event listener for action buttons
const handleTableActions = (): void => {
    document.getElementById("request-selection-btn")?.addEventListener("click", requestSelection);
    document.getElementById("edit-selection-btn")?.addEventListener("click", editSelection);
    document.getElementById("delete-selection-btn")?.addEventListener("click", deleteSelection);
    document.getElementById("request-selection")?.addEventListener("change", requestSelection);

    document.getElementById("clear-btn")?.addEventListener("click", clearSelection);

    const checkboxes = document.querySelectorAll<HTMLInputElement>('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
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
        profileImage.src = "/path/to/profile/photo.jpg";
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

export { reloadMaterialsTable };