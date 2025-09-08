import User from '../DBClasses/Front/FUser.js';
import Class from '../DBClasses/Front/FClass.js';
import Building from '../DBClasses/Front/FBuilding.js';

// Variable Declaration
let map;
let currentUser = null;
let dest_lat = 34.06389513413786;
let dest_long = -118.16915089498868;
let userMarker;
let currControl;
let start = true;
let user_lat, user_long;
let GH_KEY;


//Function Declaration

//-------------------------V ROUTING FUNCTIONALITY V--------------------------------------
// returns a routing control with a given end destination , WHERE KEY IS USED
    const pedestrianControl = (end_lat,end_long) => {
        return L.Routing.control({
        waypoints: [
            L.latLng(user_lat, user_long),
            L.latLng(end_lat,end_long)
        ],
        createMarker: function() { return null; },
        router: new L.Routing.GraphHopper(backupGhKey , {
            urlParameters: {
                vehicle: 'foot'
            }
        })
    })};
    const navigateTo = (lat, lng) => {
        console.log(`Navigating to Latitude: ${lat}, Longitude: ${lng}`);
        updateDest(lat, lng); // Update the destination for the routing logic
        map.setView([lat, lng], 18); // Center the map on the selected location
    };
    
// updates the detination and resets the routing
const updateDest = (end_lat, end_long) => {
    //fetchApiKey();
    if(end_lat == null || end_long==null || map==null || currControl==null) {
        console.log(end_lat == null, end_long==null , map==null ,currControl==null)
        return; 
    }
    // const { lat, lng } = new L.latLng(end_lat, end_long);
    // endMarker.setLatLng(new L.latLng(lat,lng));
    // map.removeControl(currControl);
    // currControl = pedestrianControl(lat, lng);
    // currControl.addTo(map);

     // Set waypoints for the control
     currControl.setWaypoints([
        new L.latLng(user_lat, user_long),
        new L.latLng(end_lat, end_long)
    ]);

    dest_lat = end_lat;
    dest_long = end_long;
}
//-------------------------^ ROUTING FUNCTIONALITY ^--------------------------------------

// Function to instantiate current user 
const fetchUser = async () => {
    console.log("fetching user")
    try {
        const response = await fetch('http://localhost:3000/api/user');
       // const response = await fetch('https://scholar-path.onrender.com/api/user');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        currentUser = new User(data.currentUser.username, data.currentUser.password, 
            data.currentUser.cin, data.currentUser.fname, data.currentUser.lname, []);
            
        data.currentUser.classes.forEach((c) => {
            currentUser.classes.push(new Class(c.subject, c.catalog, c.section, c.number,
                c.title, c.days, c.start, c.end, new Building(c.building.name, c.building.latitude, c.building.longitude), c.room, c.instructor));
        });

        // Get the <ul> element and clear any existing list items
        const ul = document.getElementById('selection');
        ul.innerHTML = '';
        
        currentUser.getClasses().forEach((classItem, index) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.id = `slot${index + 1}`;
            li.textContent = classItem.getTitle();
            if (index === 0) li.classList.add('active');
            ul.appendChild(li);

            // Assign the onclick function to each class item
            li.onclick = () => {
                // Handle active class switching and map update
                document.querySelectorAll('li').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
                updateDest(classItem.getBuilding().getLat(), classItem.getBuilding().getLong());
                map.setView([(classItem.getBuilding().getLat() + user_lat) / 2, (classItem.getBuilding().getLong() + user_long) / 2]);
            };
        });

    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

// onclick function for X button to clear search
function clearSearch() {
    const searchInput = document.getElementById('search');
    const searchlist = document.getElementById('search-results');
    searchInput.value = "";  // Clear the input field
    searchlist.innerHTML = "";  // Clear the search results
    searchlist.style.display = 'none';  // Hide the dropdown
}

// Runs when User allows Location Permission
// Includes just about the entire map interface
const success = (position) => {
    if(start === true) {
        console.log("starting");
        console.log("position retrieved first");
    } else {
        console.log("position updated");
    }

//-------------------------V INSTANTIATE CURRENT USER V--------------------------------------
    // User location coordinates
    user_lat = position.coords.latitude;
    user_long = position.coords.longitude;
    console.log('coords:',user_lat,user_long)

    // Call the fetchUser function
    if(!currentUser) fetchApiKey();
    if(!currentUser) fetchUser();
//-------------------------^ INSTANTIATE CURRENT USER ^--------------------------------------


//-------------------------V SEARCH BUILDING V-------------------------------------- 
    //add functionality to x button on search bar
    document.getElementById('clear-search').onclick = clearSearch;

    //create a debounce to stop constant search while typing to limit calls to DB
    let debounceTimeout;
    // Event listener for the search bar
    document.getElementById('search').addEventListener('input', function () {
        // clear on timer new input
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            // regex to stop special characters from being queried
            const regex = /[^A-Za-z0-9]/;
            const query = this.value.trim(); // Get the current value of the search bar
            const searchlist = document.getElementById('search-results');
            searchlist.innerHTML = ''; // Clear results
            // Only start searching if the query length is greater than 2 characters
            if (query && query.length > 2 && !regex.test(query)) { 
            try {
                // Send the search query to the API endpoint for buildings
                const response = await fetch(`http://localhost:3000/api/searchBuildings?query=${encodeURIComponent(query)}`);
                //const response = await fetch(`https://scholar-path.onrender.com/api/searchBuildings?query=${encodeURIComponent(query)}`);
                if (response.status === 404) {
                    searchlist.innerHTML = '<li>No results found</li>';
                    searchlist.style.display = 'block';  // Show the message
                    searchlist.style.position = 'absolute'; // Ensure it's not being clipped
                    searchlist.style.zIndex = '5000'; // Ensure it's above other content
                    return;
                }
                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data.results.rows)
                // Add each returned item as a list element
                data.results.rows.forEach((b) => {
                    const li = document.createElement('li');
                    li.textContent = b.BuildingName;
                    // on click will reroute user to destination
                    li.onclick = () => {
                        updateDest(b.Latitude, b.Longitude);
                        map.setView([(b.Latitude + user_lat)/2,(b.Longitude + user_long)/2]);
                        document.querySelectorAll('li').forEach(li => {li.classList.remove('active');});
                        li.classList.add('active');
                    };
                    searchlist.append(li);
                });
                //make results visible
                searchlist.style.display = 'block'; // Ensure it's visible
                searchlist.style.position = 'absolute'; // Ensure it's not being clipped
                searchlist.style.zIndex = '5000'; // Ensure it's above other content
            } catch (error) {
                console.error('Error fetching building search results:', error);
            }
            } else {
                searchlist.style.display = 'none'; // Hide if query is too short or invalid
            }
        }, 500);
    });
//-------------------------^ SEARCH BUILDING ^--------------------------------------


//-------------------------V CSS ADJUSTMENTS V--------------------------------------
    function updateMapHeight(len = 200) {
        const mapElement = document.getElementById('map');
        const selectionHeight = parseFloat(getComputedStyle(document.getElementsByClassName('dd-container')[0]).height);
        const headerHeight = parseFloat(getComputedStyle(document.getElementById('header')).height);
        const searchbarHeight = parseFloat(getComputedStyle(document.getElementsByClassName('search-container')[0]).height);
        const windowHeight = window.innerHeight;

        // Set the map element's height dynamically
        mapElement.style.setProperty('height', (windowHeight - selectionHeight - headerHeight - searchbarHeight) + 'px', 'important');
        
        // Assuming 'map' is your Leaflet map object:
        setTimeout(function() {
            map.invalidateSize(true); // Ensure Leaflet recalculates map size
        }, len);
    }

   
    if(start == true) {
         // Initial setup when the page loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                updateMapHeight(300);
            }, 200);
        });
        // Update on window resize
        window.addEventListener('resize', updateMapHeight);

        // Toggle visibility of the list on header click (dropdown)
        document.getElementById('classes-header').addEventListener('click', () => {
            const ul = document.getElementById('selection');
            if (ul.classList.contains('open')) {
                // First, set the height to its current scrollHeight for smooth transition
                ul.style.height = `${ul.scrollHeight}px`;
        
                // Trigger a reflow (force the browser to calculate the current height)
                requestAnimationFrame(() => {
                    ul.style.height = '0px'; // Animate it to 0px
                });
        
                ul.classList.remove('open');
            } else {
                // Set initial height to 0px to start the transition
                ul.style.height = '0px';
                ul.classList.add('open');
                
                // Use requestAnimationFrame to trigger the opening animation
                requestAnimationFrame(() => {
                    ul.style.height = `${ul.scrollHeight}px`; // Transition to the full height
                });
            }
            setTimeout(function(){ updateMapHeight()}, 200);
        });
    }
//-------------------------^ CSS ADJUSTMENTS ^--------------------------------------


//-------------------------V MAP INITIALIZATION V--------------------------------------
    if(!map) {
        // creates map centered at user location with zoom level 18
        map = L.map('map').setView([user_lat, user_long],18);
        //adds tilelayer
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 22,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        //adds center button functionality
        document.getElementById('center-user').onclick = () => {
            map.flyTo([user_lat, user_long], 18, {
                duration: 0.5 // Fly-to animation duration in seconds
            });
        };

        // used to not display a marker with a blank icon
        var blankIcon = L.icon({
            iconSize:     [0, 0], // size of the icon
            shadowSize:   [0, 0], // size of the shadow
            iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
            shadowAnchor: [0, 0],  // the same for the shadow
            popupAnchor:  [0, 32] // point from which the popup should open relative to the iconAnchor
        })

        // Creates user icon for markers
        var userIcon = L.icon({
            iconUrl: '../Resources/Images/TempUserIcon.png',

            iconSize:     [32, 32], // size of the icon
            shadowSize:   [32, 32], // size of the shadow
            iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
            shadowAnchor: [0, 0],  // the same for the shadow
            popupAnchor:  [0, 32] // point from which the popup should open relative to the iconAnchor
        })
        // creates actual marker on map
        userMarker = L.marker([user_lat, user_long], {icon: userIcon}).addTo(map);

        //Initializes the main endpoint that will be used on the map
        currControl = pedestrianControl(dest_lat, dest_long);
        // currControl.on('routingerror', function(e) {
        //     if (e.error) {
        //         currControl = pedestrianControl(dest_lat, dest_long, backupGhKey);
        //     }
        // });
        currControl.addTo(map);
//-------------------------^ MAP INITIALIZATION ^--------------------------------------


//-------------------------V FOR DEBUGGING V--------------------------------------

    // //used for debugging in tandem with onclick function to change endpoint
    // var endMarker = L.marker([user_lat,user_long]).addTo(map);

    // //adds new end point and resets route based on click
    // map.on('click', function (e) {
    // //retrieves lat lng from user click
    //     const { lat, lng } = e.latlng;
    // //updates markerdeclared above's position
    //     endMarker.setLatLng(new L.latLng(lat,lng));
    // //resets the routing
    //     map.removeControl(currControl);
    //     currControl = pedestrianControl(lat, lng);
    //     currControl.addTo(map);
    // })

//-------------------------^ FOR DEBUGGING ^--------------------------------------

// -------------------------V Amenity Logic V--------------------------------------

        Display_Amenities(map);

        // Initialize the map and set its view to a specific location and zoom level
        //const map = L.map('map').setView([51.505, -0.09], 13);
        // Add a tile layer to the map (this is using OpenStreetMap's tiles)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Event listener for map clicks
        map.on('click', function(e) {
            // Get the latitude and longitude from the event
            const { lat, lng } = e.latlng;
            /// Display the coordinates in the side panel
            // Update coordinates display on map zoom to adjust to any view changes
            document.getElementById('lat').textContent = `Latitude: ${lat.toFixed(5)}`;
            document.getElementById('lng').textContent = `Longitude: ${lng.toFixed(5)}`;
        });

        // Update coordinates display on map zoom to adjust to any view changes
        map.on('zoomend', function() {
            const center = map.getCenter();
            document.getElementById('lat').textContent = `Latitude: ${center.lat.toFixed(5)}`;
            document.getElementById('lng').textContent = `Longitude: ${center.lng.toFixed(5)}`;
        });
    } 
    //runs when map is already instantiated
    else {
        if(userMarker) userMarker.setLatLng([user_lat, user_long]);
        updateDest(dest_lat, dest_long);
    }
    // -------------------------^ Amenity Logic ^--------------------------------------
}

// Runs on failure to obtain user position
const error = () => {
    console.log('No position');
}
// navigator.geolocation.getCurrentPosition(success, error);
navigator.geolocation.watchPosition((position) => {
    if(start != true) {
        // setTimeout(() => {
        // success(position);}, 5000);
        success(position);
    }
    else {success(position); start = false;}

}, error);
// setInterval(function() {
//     // asks for user location, runs map code on success
//     navigator.geolocation.getCurrentPosition(success, error);
// }, 5000); // 5000 milliseconds = 5 seconds
