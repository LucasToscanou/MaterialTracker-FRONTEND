import { backendAddress, tokenKeyword } from './constants.js';
let userProfiles = [];
let projects = [];
let locations = [];
let materialImgs = [];
let currencies = [];
// Initialize page
const initializePage = async () => {
    await getFieldOptions();
    fillHTMLElements();
};
// Call initializePage when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializePage);
const getFieldOptions = async () => {
    const token = localStorage.getItem('token');
    const fetchAllModelsData = async () => {
        const models = [
            'userprofiles',
            'projects',
            'locations',
            'materialimgs',
            'currencies'
        ];
        const fetchModelData = async (modelName) => {
            try {
                const response = await fetch(`${backendAddress}${modelName}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': tokenKeyword + token
                    },
                });
                if (response.ok) {
                    return await response.json();
                }
                else {
                    console.error(`Failed to fetch ${modelName}:`, response.statusText);
                    return null;
                }
            }
            catch (error) {
                console.error(`Error fetching ${modelName}:`, error);
                return null;
            }
        };
        const allData = await Promise.all(models.map(model => fetchModelData(model)));
        if (allData[0])
            userProfiles = allData[0];
        if (allData[1])
            projects = allData[1];
        if (allData[2])
            locations = allData[2];
        if (allData[3])
            materialImgs = allData[3];
        if (allData[4])
            currencies = allData[4];
        console.log('User Profiles:', userProfiles);
        console.log('Projects:', projects);
        console.log('Locations:', locations);
        console.log('Material Images:', materialImgs);
        console.log('Currencies:', currencies);
    };
    await fetchAllModelsData();
};
const fillHTMLElements = () => {
    const projectSelect = document.getElementById("project");
    const locationSelect = document.getElementById("currentLocation");
    const currencySelect = document.getElementById("currency");
    projects.forEach((project) => {
        const option = document.createElement("option");
        option.value = project.id.toString();
        option.textContent = project.name;
        projectSelect.appendChild(option);
    });
    locations.forEach((location) => {
        const option = document.createElement("option");
        option.value = location.id.toString();
        option.textContent = location.name;
        locationSelect.appendChild(option);
    });
    currencies.forEach((currency) => {
        const option = document.createElement("option");
        option.value = currency.id.toString();
        option.textContent = currency.name;
        currencySelect.appendChild(option);
    });
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
            const response = await fetch(`${backendAddress}material/create/`, {
                method: 'POST',
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
