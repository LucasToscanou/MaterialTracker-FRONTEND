import { backendAddress } from './constants.js';
import { reloadMaterialsTable } from './inventory.js';

function clearSelection() {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelectedCount();
}

function updateSelectedCount() {
    const selectedCountElement = document.getElementById('qty-selected');
    const selectedCount = getSelectedItems().length;

    if (selectedCountElement) {
        if (selectedCount === 0) {
            selectedCountElement.innerText = '';
        }
        else if (selectedCount === 1) {
            selectedCountElement.innerText = '1 item selected';
        }
        else {
            selectedCountElement.innerText = `${selectedCount} items selected`;
        }
    }
};

function requestSelection() {
    let requestSelection = document.getElementById("request-selection") as HTMLSelectElement;
    console.log("requestSelection");
    // let selectedValue = requestSelection.options[requestSelection.selectedIndex].value;
    // console.log(selectedValue);

    const selectedCheckboxes = getSelectedItems();
}

function editSelection() {
    const selectedItems = getSelectedItems();

    console.log(JSON.stringify({
        action: 'delete',
        selectedItems,
    }));
    fetch(backendAddress + "material/list/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'edit',
            selectedItems,
        }),
    })
        .then(response => {
            console.log(response);
            if (response.redirected) {
                window.location.href = response.url; // Navigate to the new page
            } else {
                return response.json(); // Only parse JSON if it's not a redirect
            }
        })
        .catch(error => console.error('Error:', error));

}

function deleteSelection() {
    const selectedItems = getSelectedItems();
    console.log("selectedItems:", selectedItems);
    const token = localStorage.getItem("token");

    fetch(backendAddress + "material/list/", {
        method: 'DELETE',
        body: JSON.stringify({ selectedItems }), // Wrap in an object
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            if (response.status === 204) {
                console.log("Materials deleted successfully.");
                reloadMaterialsTable(); // Reload the table after successful deletion
                return null;
            } else if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                console.log("Response data:", data);
            }
        })
        .catch(error => console.error('Error:', error));
}





function getSelectedItems(): string[] {
    const checkboxes = document.querySelectorAll<HTMLInputElement>('.checkbox');
    const selectedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    const selectedItems = selectedCheckboxes.map(checkbox => checkbox.value);

    return selectedItems;
}


export { clearSelection, updateSelectedCount, requestSelection, editSelection, deleteSelection };