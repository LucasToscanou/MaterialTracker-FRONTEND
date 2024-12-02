// Import constants
import { backendAddress } from './constants.js';
import { checkAuthentication } from './authUtils.js';
import { clearSelection, updateSelectedCount, requestSelection, editSelection, deleteSelection } from './inventoryOperations.js';
// // Example Data
const columns = ["Ref", "Description", "Capacity", "Project", "Current Location", "Quality Exp Date", "Cost"];
// Initialize page
const initializePage = () => {
    fillHeader();
    populateColumns();
    populateMaterials();
    handleTableActions();
};
// Call initializePage when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializePage);
const populateColumns = () => {
    const columnsRow = document.getElementById("columns-row");
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
const populateMaterials = () => {
    const materialsTbody = document.getElementById("materials-tbody");
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
        .then((materials) => {
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
const reloadMaterialsTable = () => {
    const materialsTbody = document.getElementById("materials-tbody");
    materialsTbody.innerHTML = ""; // Clear the current table contents
    populateMaterials(); // Repopulate the table
};
// Event listener for action buttons
const handleTableActions = () => {
    var _a, _b, _c, _d, _e;
    (_a = document.getElementById("request-selection-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", requestSelection);
    (_b = document.getElementById("edit-selection-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", editSelection);
    (_c = document.getElementById("delete-selection-btn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", deleteSelection);
    (_d = document.getElementById("request-selection")) === null || _d === void 0 ? void 0 : _d.addEventListener("change", requestSelection);
    (_e = document.getElementById("clear-btn")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", clearSelection);
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
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
        profileImage.src = "/path/to/profile/photo.jpg";
        profileName.textContent = username;
        dropdownMenu.innerHTML = `
            <li><a class="dropdown-item" href="/passwordChange.html">Change password</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="/logout.html">Sign out</a></li>
        `;
    }
    else {
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
