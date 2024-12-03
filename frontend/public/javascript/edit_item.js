import { backendAddress, tokenKeyword } from './constants.js';
export let userProfiles = [];
export let projects = [];
export let locations = [];
export let materialImgs = [];
export let currencies = [];
// Initialize page
let fieldoptions = {
    userProfiles: null,
    projects: null,
    locations: null,
    materialImgs: null,
    currencies: null,
};
const initializePage = async () => {
    fieldoptions = await getFieldOptions();
    // fillHTMLElements();
    fillCurrentFields();
};
// Call initializePage when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializePage);
export const getFieldOptions = async () => {
    const token = localStorage.getItem('token');
    const models = [
        'userprofiles',
        'projects',
        'locations',
        'materialimgs',
        'currencies',
    ];
    const fetchModelData = async (modelName) => {
        try {
            const response = await fetch(`${backendAddress}${modelName}/`, {
                method: 'GET',
                headers: {
                    'Authorization': tokenKeyword + token,
                },
            });
            if (response.ok) {
                return await response.json();
            }
            else {
                console.warn(`Failed to fetch ${modelName}:`, response.statusText);
                throw new Error('Failed to fetch material');
            }
        }
        catch (error) {
            console.error(`Error fetching ${modelName}:`, error);
            return null;
        }
    };
    const allData = await Promise.all(models.map(fetchModelData));
    const data = {
        userProfiles: allData[0],
        projects: allData[1],
        locations: allData[2],
        materialImgs: allData[3],
        currencies: allData[4],
    };
    console.log('Fetched Data:', data);
    return data;
};
const fillCurrentFields = async () => {
    let materialId = 0;
    let material = null;
    try {
        const urlParams = new URLSearchParams(window.location.search);
        materialId = parseInt(urlParams.get('id') || '0');
        try {
            material = await getItem(materialId);
        }
        catch (error) {
            console.error('Error in example usage:', error);
        }
        console.log('Fetched Material:', material);
    }
    catch (error) {
        console.error('Error in example usage:', error);
    }
    const user = localStorage.getItem('user');
    const projectSelect = document.getElementById("project");
    const locationSelect = document.getElementById("currentLocation");
    const currencySelect = document.getElementById("currency");
    if (fieldoptions.projects) {
        fieldoptions.projects.forEach((project) => {
            const option = document.createElement("option");
            option.value = project.id.toString();
            option.textContent = project.name;
            if (project.id === (material === null || material === void 0 ? void 0 : material.project)) {
                option.selected = true;
            }
            projectSelect.appendChild(option);
        });
    }
    if (fieldoptions.locations) {
        fieldoptions.locations.forEach((location) => {
            const option = document.createElement("option");
            option.value = location.id.toString();
            option.textContent = location.name;
            if (location.id === (material === null || material === void 0 ? void 0 : material.current_location)) {
                option.selected = true;
            }
            locationSelect.appendChild(option);
        });
    }
    if (fieldoptions.currencies) {
        fieldoptions.currencies.forEach((currency) => {
            const option = document.createElement("option");
            option.value = currency.id.toString();
            option.textContent = currency.name;
            if (currency.id === (material === null || material === void 0 ? void 0 : material.currency)) {
                option.selected = true;
            }
            currencySelect.appendChild(option);
        });
    }
    if (material) {
        document.getElementById("reference").value = material.ref;
        document.getElementById("description").value = material.description;
        document.getElementById("cost").value = material.cost.toString();
        document.getElementById("qualityExpDate").value = new Date(material.quality_exp_date).toISOString().split('T')[0];
    }
    const cancelButton = document.getElementById("cancelButton");
    cancelButton.addEventListener("click", () => {
        window.location.href = "/inventory.html";
    });
    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", async (event) => {
        var _a;
        event.preventDefault();
        const reference = document.getElementById("reference").value;
        const description = document.getElementById("description").value;
        const projectId = document.getElementById("project").value;
        const locationId = document.getElementById("currentLocation").value;
        const cost = document.getElementById("cost").value;
        const currencyId = document.getElementById("currency").value;
        const quality_exp_date = document.getElementById("qualityExpDate").value;
        const photo = (_a = document.getElementById("photo").files) === null || _a === void 0 ? void 0 : _a[0];
        const newMaterial = {
            // main_img: photo ? photo.name : '',
            ref: reference,
            description: description,
            project: parseInt(projectId),
            current_location: parseInt(locationId),
            currency: parseInt(currencyId),
            cost: parseFloat(cost),
            quality_exp_date: quality_exp_date
        };
        console.log('New Material:', newMaterial);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${backendAddress}material/list/${materialId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': tokenKeyword + token
                },
                body: JSON.stringify(newMaterial)
            });
            if (response.ok) {
                alert("Item added successfully!");
                window.location.href = "/inventory.html";
            }
            else {
                console.error('Failed to add material:', response.statusText);
                alert("Failed to add item. Please try again.");
            }
        }
        catch (error) {
            console.error('Error adding material:', error);
            alert("An error occurred. Please try again.");
        }
    });
};
const getItem = async (id) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${backendAddress}material/list/${id}/`, {
            method: 'GET',
            headers: {
                'Authorization': tokenKeyword + token,
            },
        });
        if (response.ok) {
            return await response.json();
        }
        else {
            console.error('Failed to fetch material:', response.statusText);
            throw new Error('Failed to fetch material');
        }
    }
    catch (error) {
        console.error('Error fetching material:', error);
        throw error;
    }
};
