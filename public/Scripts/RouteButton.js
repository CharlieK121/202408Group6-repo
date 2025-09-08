// Ensure the map object is available globally or passed as an argument
function addRoutingButton(map) {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            // Get the marker's popup
            const popup = layer.getPopup();
            if (popup) {
                const originalContent = popup.getContent();
                const buttonHTML = `
                    <br>
                    <button 
                        class="simple-button" 
                        class="simple-button navigate-button"
                        title="Navigate to this location" 
                        aria-label="Navigate to this location" 
                        data-lat="${layer.getLatLng().lat}" 
                        data-lng="${layer.getLatLng().lng}">
                        Go
                    </button>
                `;
                // Append the button to the existing popup content
                popup.setContent(originalContent + buttonHTML);

                layer.on('popupopen', () => {
                    const button = document.querySelector('.navigate-button');
                    if (button) {
                        button.addEventListener('click', (e) => {
                            const lat = e.target.getAttribute('data-lat');
                            const lng = e.target.getAttribute('data-lng');
                            navigateTo(map, parseFloat(lat), parseFloat(lng));
                        });
                    }
                });
            }
        }
    });
}


// Navigation function to center the map
function navigateTo(map, lat, lng) {
    console.log(`Navigating to Latitude: ${lat}, Longitude: ${lng}`);
    map.setView([lat, lng], 18); // Adjust the map view
}

// Make sure to expose the `navigateTo` function globally
window.navigateTo = navigateTo;
