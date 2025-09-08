

// Declare global variables
let map, currControl, user_lat, user_long; 

// Routing function using GraphHopper
const pedestrianControl = (start_lat, start_long, end_lat, end_long) => {
    return L.Routing.control({
        waypoints: [
            L.latLng(start_lat, start_long), // Start point
            L.latLng(end_lat, end_long),    // End point
        ],
        router: new L.Routing.GraphHopper('4454408e-6854-4d4f-90cf-b6e5e7b6a517', {
            urlParameters: {
                vehicle: 'foot', // Pedestrian routing
            },
        }),
        createMarker: (i, waypoint) => { //creates marker
            return L.marker(waypoint.latLng, {
                icon: L.icon({
                    iconUrl: '../Resources/Images/TempUserIcon.png', // Start marker icon
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                }),
            });
        },
    });
};

//function to update the destination on the map
const updateDest = (end_lat, end_long) => {
    if (currControl) map.removeControl(currControl);

    currControl = L.Routing.control({
        waypoints: [
            L.latLng(user_lat, user_long),
            L.latLng(end_lat, end_long),
        ],
        router: new L.Routing.GraphHopper('4454408e-6854-4d4f-90cf-b6e5e7b6a517', { urlParameters: { vehicle: 'foot' } }),
    }).addTo(map);
    
    currControl.addTo(map);

    //sets the map view to get the map to zoom out to show the whole route
    map.setView([(end_lat) / 2, (end_lat) / 2]);
};

//button to center on users current location
document.getElementById('center-user').onclick = () => {
    map.flyTo([user_lat, user_long], 18, {
        duration: 0.5 // Fly-to animation duration in seconds
    });
};

//event listener for the class selection
document.addEventListener('DOMContentLoaded', () => {
    const dropdownHeader = document.getElementById('classes-header');
    const dropdownMenu = document.getElementById('selection');

    // Toggle dropdown visibility
    dropdownHeader.addEventListener('click', () => {
        const isVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isVisible ? 'none' : 'block';
    });

    // Handle dropdown item selection
    const classItems = document.querySelectorAll('.list-group-item');
    classItems.forEach((item) => {
        item.addEventListener('click', () => {
            // Remove 'active' class from all items
            classItems.forEach((li) => li.classList.remove('active'));

            // Add 'active' class to the clicked item
            item.classList.add('active');

            // Retrieve latitude and longitude from data attributes
            const lat = parseFloat(item.dataset.lat);
            const long = parseFloat(item.dataset.long);

            // Call updateDest and update the map view
            updateDest(lat, long);
           // handleBuildingSelection();
        });
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (e) => {
        if (!dropdownHeader.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
});


// Geolocation success handler when the user accepts 
const success = (position) => {
    // Set user location 
    user_lat = position.coords.latitude;
    user_long = position.coords.longitude;

    // Initialize map object that is then centered at user's location
    map = L.map('map').setView([user_lat, user_long], 18);

    // Add tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 22,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map); 

    // User marker icon is pulled from public folder
    const userIcon = L.icon({
        iconUrl: '../Resources/Images/TempUserIcon.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, 32],
    });

    // Add user marker to map
    L.marker([user_lat, user_long], { icon: userIcon }).addTo(map);
};

// Geolocation error handler when location is turned off or user declines
const error = () => {
    console.log('Unable to retrieve location.');
    document.getElementById('map').innerHTML = '<p>Location access is required to display the map.</p>';
};

// Request user's location in allow or deny block
navigator.geolocation.getCurrentPosition(success, error);

//Event listener which watches the input of the user and returns the search results in a dynamic dropdown
document.addEventListener('DOMContentLoaded', function () {
    const search = document.getElementById('search');
    const results = document.getElementById('search-results');

    //Event listnener that watch input element
    search.addEventListener('input', function () {
        const searchTerm = search.value.trim(); // the trim function removes whitespaces
        //Starts search once length is greater than 2
        if (searchTerm.length > 2) {
            fetch('/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchTerm }),
            })
                .then(response => response.json())
                .then(data => {
                    // Build the dropdown results
                    const html = data.map(
                        result => 
                            `<li class="result-item" 
                        data-lat="${result.Latitude}" 
                        data-long="${result.Longitude}">
                        ${result.BuildingName}</li>`
                    ).join('');

                    results.innerHTML = html; // Update the dropdown list
                    results.style.display = 'block'; // Show the dropdown
                })
                .catch(error => console.error('Error:', error));
        } else {
            results.innerHTML = ''; // Clear results
            results.style.display = 'none'; // Hide the dropdown
        }
    });

    //Event listner to handle result selection on click
    results.addEventListener('click', function (e) {
        if (e.target && e.target.matches('li.result-item')) {
            const selectedBuilding = e.target.textContent;
            const lat = e.target.dataset.lat;
            const long = e.target.dataset.long;

           // console.log(`Selected: ${selectedBuilding} (Lat: ${lat}, Long: ${long})`);

            updateDest(lat, long);

            // Perform any action, e.g., update the map or input field
            search.value = selectedBuilding.trim(); // Set input name to selected value
            results.style.display = 'none'; // Hide the dropdown
        }
    });

    // Hide the dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!search.contains(e.target) && !results.contains(e.target)) {
            results.style.display = 'none';
        }
    });

    document.addEventListener('click', function (e) {
        if (!search.contains(e.target) && !results.contains(e.target)) {
            results.style.display = 'none';
        }
    });
});



document.getElementById('clear-search').onclick = () => {
    const searchInput = document.getElementById('search');
    const searchlist = document.getElementById('search-results');
    searchInput.value = "";  // Clear the input field
    searchlist.innerHTML = "";  // Clear the search results
    searchlist.style.display = 'none';  // Hide the dropdown
};

