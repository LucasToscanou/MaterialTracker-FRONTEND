// Import constants
import { backendAddress, Material, UserProfile, Project, Location, MaterialImg, Currency } from './constants.js';
import { checkAuthentication } from './authUtils.js';
import { clearSelection, updateSelectedCount, editItem, deleteSelection } from './inventoryOperations.js';
import { getFieldOptions } from './add_item.js';

// Example Data
const columns: string[] = ["Ref", "Description", "Project", "Current Location", "Quality Exp Date", "Cost"];

interface MaterialMore extends Material {
    id: number;
    mainImg: string;
};

// Initialize page
let fieldoptions: {
    userProfiles: UserProfile[] | null;
    projects: Project[] | null;
    locations: Location[] | null;
    materialImgs: MaterialImg[] | null;
    currencies: Currency[] | null;
} = {
    userProfiles: null,
    projects: null,
    locations: null,
    materialImgs: null,
    currencies: null,
};

const initializePage = async (): Promise<void> => {
    fieldoptions = await getFieldOptions();
    fillHeader();
    populateColumns();
    await populateMaterials();
};

// Call initializePage when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializePage);

const populateColumns = (): void => {
    const columnsRow = document.getElementById("columns-row")!;
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

const populateMaterials = async (): Promise<void> => {
    const materialsTbody = document.getElementById("materials-tbody")!;
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(backendAddress + "material/list/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch materials");
        }

        const materials: MaterialMore[] = await response.json();
        materials.forEach((material) => {
            const row = document.createElement("tr");

            const checkboxCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "checkbox";
            checkbox.value = material.id.toString();
            checkboxCell.appendChild(checkbox);
            row.appendChild(checkboxCell);

            const imgCell = document.createElement("td");
            const img = document.createElement("img");
            img.src = "./images/generic_item.jpg";
            img.className = "border rounded";
            img.style.height = "100px";
            img.alt = "Material Image";
            imgCell.appendChild(img);
            row.appendChild(imgCell);

            const refCell = document.createElement("td");
            refCell.textContent = material.ref;
            row.appendChild(refCell);

            const descCell = document.createElement("td");
            descCell.textContent = material.description;
            row.appendChild(descCell);

            const projectCell = document.createElement("td");
            projectCell.textContent = fieldoptions.projects ? fieldoptions.projects[material.project].name : 'N/A';
            row.appendChild(projectCell);

            const locationCell = document.createElement("td");
            locationCell.textContent = fieldoptions.locations ? fieldoptions.locations.find(loc => loc.id === material.current_location)?.name : 'N/A';
            row.appendChild(locationCell);

            const qualityExpDateCell = document.createElement("td");
            qualityExpDateCell.textContent = new Date(material.quality_exp_date).toISOString().split('T')[0];
            row.appendChild(qualityExpDateCell);

            const costCell = document.createElement("td");
            costCell.textContent = `${material.cost} ${fieldoptions.currencies ? fieldoptions.currencies[material.currency]?.name : 'N/A'}`;
            row.appendChild(costCell);

            const actionCell = document.createElement("td");
            const editButton = document.createElement("button");
            editButton.className = "btn btn-secondary";
            editButton.dataset.action = "edit";
            editButton.dataset.id = material.id.toString();
            editButton.textContent = "Edit";
            actionCell.appendChild(editButton);
            row.appendChild(actionCell);

            materialsTbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error populating materials:", error);
    } finally {
        handleTableActions();
    }
};

const reloadMaterialsTable = (): void => {
    const materialsTbody = document.getElementById("materials-tbody")!;
    materialsTbody.innerHTML = ""; // Clear the current table contents
    populateMaterials(); // Repopulate the table
};

// Event listener for action buttons
const handleTableActions = (): void => {
    document.getElementById("delete-selection-btn")?.addEventListener("click", deleteSelection);
    document.getElementById("clear-btn")?.addEventListener("click", clearSelection);

    const checkboxes = document.querySelectorAll<HTMLInputElement>('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
    });

    const editButtons = document.querySelectorAll<HTMLButtonElement>('button[data-action="edit"]');
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const materialId = (event.currentTarget as HTMLButtonElement).dataset.id;
            if (materialId) {
                editItem(materialId);
            }
        });
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
    }
}

export { reloadMaterialsTable };