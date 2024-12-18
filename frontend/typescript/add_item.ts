import { backendAddress, tokenKeyword, UserProfile, Project, Location, Material, MaterialImg, Currency } from './constants.js';

export let userProfiles: UserProfile[] = [];
export let projects: Project[] = [];
export let locations: Location[] = [];
export let materialImgs: MaterialImg[] = [];
export let currencies: Currency[] = [];

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
    fillHTMLElements();
};

// Call initializePage when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializePage);


export const getFieldOptions = async (): Promise<{
    userProfiles: any[] | null;
    projects: any[] | null;
    locations: any[] | null;
    materialImgs: any[] | null;
    currencies: any[] | null;
}> => {
    const token = localStorage.getItem('token');

    const models = [
        'userprofiles',
        'projects',
        'locations',
        'materialimgs',
        'currencies',
    ];

    const fetchModelData = async (modelName: string): Promise<any[] | null> => {
        try {
            const response = await fetch(`${backendAddress}${modelName}/`, {
                method: 'GET',
                headers: {
                    'Authorization': tokenKeyword + token,
                },
            });

            if (response.ok) {
                return await response.json();
            } else {
                console.warn(`Failed to fetch ${modelName}:`, response.statusText);
                return null;
            }
        } catch (error) {
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


const fillHTMLElements = (): void => {
    const projectSelect = document.getElementById("project") as HTMLSelectElement;
    const locationSelect = document.getElementById("currentLocation") as HTMLSelectElement;
    const currencySelect = document.getElementById("currency") as HTMLSelectElement;

    if (fieldoptions.projects) {
        fieldoptions.projects.forEach((project) => {
            const option = document.createElement("option");
            option.value = project.id.toString();
            option.textContent = project.name;
            projectSelect.appendChild(option);
        });
    }

    if (fieldoptions.locations) {
        fieldoptions.locations.forEach((location) => {
            const option = document.createElement("option");
            option.value = location.id.toString();
            option.textContent = location.name;
            locationSelect.appendChild(option);
        });
    }

    if (fieldoptions.currencies) {
        fieldoptions.currencies.forEach((currency) => {
            const option = document.createElement("option");
            option.value = currency.id.toString();
            option.textContent = currency.name;
            currencySelect.appendChild(option);
        });
    }

    const cancelButton = document.getElementById("cancelButton")!;
    cancelButton.addEventListener("click", () => {
        window.location.href = "/inventory.html";
    });

    const saveButton = document.getElementById("saveButton")!;
    saveButton.addEventListener("click", async (event) => {
        event.preventDefault();
    
        const reference = (document.getElementById("reference") as HTMLInputElement).value;
        const description = (document.getElementById("description") as HTMLInputElement).value;
        const projectId = (document.getElementById("project") as HTMLSelectElement).value;
        const locationId = (document.getElementById("currentLocation") as HTMLSelectElement).value;
        const cost = (document.getElementById("cost") as HTMLInputElement).value;
        const currencyId = (document.getElementById("currency") as HTMLSelectElement).value;
        const quality_exp_date = (document.getElementById("qualityExpDate") as HTMLInputElement).value;
        const photo = (document.getElementById("photo") as HTMLInputElement).files?.[0];

        const newMaterial: Material = {
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
            } else {
                console.error('Failed to add material:', response.statusText);
                alert("Failed to add item. Please try again.");
            }
        } catch (error) {
            console.error('Error adding material:', error);
            alert("An error occurred. Please try again.");
        }
    });
};

