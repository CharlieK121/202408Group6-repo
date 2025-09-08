function navigateTo(lat, lng) {
    console.log(`Navigating to Latitude: ${lat}, Longitude: ${lng}`);
    // Center the map on the selected coordinates
    map.setView([lat, lng], 18);
    // Optionally, add routing logic here if needed
    currControl.setWaypoints([
        new L.latLng(user_lat, user_long),
        new L.latLng(lat, lng)
    ]);
}

class Amenity {
    constructor(id, coords, name, info, Icon) {
        this.id =id,
        this.coords = coords,
        this.name = name,
        this.info = info
        this.Icon = Icon
    
    }
}// End of amenity class


class Amenities {
    constructor(map) {
        this.map = map;
        this.zoomThreshold = 18;

        // Marker data
        this.markers = [];
        this.markersData = [];

        this.createMarkers();
        this.handleMapZoom();
        this.handleMapClicks();
    }

    createMarkers() {
        this.markersData.forEach(markerData => {
            // Log to verify each icon is initialized
            console.log("Creating marker with icon:", markerData.Icon.options.iconUrl);
    
            // Check if the icon is valid and log an error if it’s not
            if (!markerData.Icon) {
                console.error(`Icon for marker with ID ${markerData.id} is undefined or invalid.`);
                return;
            }
    
            // Create the marker with the specified icon
            const marker = L.marker(markerData.coords, { icon: markerData.Icon }).addTo(this.map);
    
            // Define the popup content with a "Go" button
            const popupContent = `
            <b>${markerData.name || ''}</b><br>${markerData.info}
            <br>
            <div class="styled-button-container">
                <button class="styled-button" onclick="navigateTo(${markerData.coords[0]}, ${markerData.coords[1]})">Go</button>
            </div>
        `;
        

            const popup = L.popup({
                closeOnClick: true,
                autoClose: true
            }).setContent(popupContent);
    
            // Set up click event for the marker to open the popup
            marker.on('click', () => {
                popup.setLatLng(markerData.coords);
                popup.openOn(this.map);
            });
    
            // Store marker reference with the associated large icon for zoom handling
            this.markers.push({ marker, bigIcon: markerData.Icon });
        });
    }
    


    handleMapClicks() {
        this.map.on('click', (e) => {
            this.markersData.forEach(markerData => {
                const distance = this.map.latLngToLayerPoint(markerData.coords).distanceTo(this.map.latLngToLayerPoint(e.latlng));
                if (distance < 30) {
                    // Check if a marker already exists for this markerData
                const marker = this.markers.find(m => m.marker.getLatLng().equals(markerData.coords));
                
                if (marker) {
                    // Open the existing popup instead of creating a new one
                    marker.marker.openPopup();
                } else {
                    // Fallback: Create and open a new popup if no marker exists
                    const popup = L.popup({
                        closeOnClick: true,
                        autoClose: true
                    }).setContent(`<b>${markerData.name}</b><br>${markerData.info}`);
                    popup.setLatLng(markerData.coords);
                    popup.openOn(this.map);
                }
            }
        });   
        });
    }

    handleMapZoom() {
        this.map.on('zoomend', () => {
            const currentZoom = this.map.getZoom();
            this.markers.forEach(({ marker, bigIcon }) => {
                // Update the icon based on zoom level
                const newIcon = currentZoom >= this.zoomThreshold ? bigIcon : get_icons('small');
                marker.setIcon(newIcon);
    
                // Reattach the popup (in case it's disconnected)
                if (!marker.getPopup()) {
                    const markerData = this.markersData.find(md => md.coords[0] === marker.getLatLng().lat && md.coords[1] === marker.getLatLng().lng);
                    if (markerData) {
                        const popupContent = `
    <b>${markerData.name || ''}</b><br>${markerData.info}
    <br>
    <div class="styled-button-container">
        <button class="styled-button" onclick="navigateTo(${markerData.coords[0]}, ${markerData.coords[1]})">Go</button>
    </div>
`;

                        const popup = L.popup().setContent(popupContent);
                        marker.bindPopup(popup);
                    }
                }
            });
        });
    }

    addAmenity(id, coords, name, info, Icon){
        // create a new amenity with the given data
        const newAmenity = new Amenity(id, coords, name, info, Icon)
        // insert new created amenity
        this.markersData.push(newAmenity)
    }
}

function Display_Amenities(map){
    const LibraryAmenities = new Amenities(map);
    const FoodCourtAmenities = new Amenities(map);
    //addRoutingButton(map)
    
    LibraryAmenities.addAmenity(1, [34.06748, -118.16750], "Kennedy Library", get_info("Kennedy Library"), get_icons('transparent'))
    LibraryAmenities.addAmenity(2, [34.06698, -118.16740], "Everytable", get_info("Everytable"), get_icons('transparent'))
    LibraryAmenities.addAmenity(3, [34.06784, -118.16719], "Cafe 47", get_info("Cafe 47"), get_icons('cafe'))
    FoodCourtAmenities.addAmenity(1, [34.06502, -118.17037], "Panda Express", get_info("Panda Express"), get_icons('transparent'))
    FoodCourtAmenities.addAmenity(1, [34.06552, -118.17038], "Carl's Jr", get_info("Carl's Jr"), get_icons('transparent'))
    FoodCourtAmenities.addAmenity(1, [34.06532, -118.17036], "El Pollo Loco", get_info("El Pollo Loco"), get_icons('food'))
    FoodCourtAmenities.addAmenity(1, [34.06731953799991, -118.16860049967109], "The University Club", get_info("The University Club"), get_icons('transparent'))
    FoodCourtAmenities.addAmenity(1, [34.067708282874044, -118.16880153558226], "The Spot", get_info("The Spot"), get_icons('food'))
    //LibraryAmenities.addAmenity(1, [34.06379, -118.16953], "King Coffee", get_info("King Coffee"), get_icons('cafe'))
    LibraryAmenities.createMarkers()
    FoodCourtAmenities.createMarkers()
}

function route(){
    currControl = pedestrianControl(dest_lat, dest_long);
        currControl.addTo(map);
}

function get_icons(name){
    
    // Define icons
    cafeIcon = L.icon({
        iconUrl: '../Resources/Images/coffee-cup.png', 
        iconSize: [32, 32], 
        iconAnchor: [16, 32], 
        popupAnchor: [0, -32]   
    });
    foodIcon = L.icon({
        iconUrl: '../Resources/Images/foodicon.png', 
        iconSize: [32, 32], 
        iconAnchor: [16, 32], 
        popupAnchor: [0, -32]   
    });
    bathroomIcon = L.icon({
        iconUrl: '../Resources/Images/bathroom icon.png', 
        iconSize: [32, 32], 
        iconAnchor: [16, 32], 
        popupAnchor: [0, -32]
    });
    transparentIcon = L.icon({
        iconUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', 
        iconSize: [0, 0], 
        iconAnchor: [0, 0]
    });
    smallIcon = L.icon({
        iconUrl: '../Resources/Images/dot.png', 
        iconSize: [4, 4], 
        iconAnchor: [2, 2]
    });
    
    const icons = {
        cafe: cafeIcon,
        food: foodIcon,
        bathroom: bathroomIcon,
        transparent: transparentIcon,
        small: smallIcon
    };
    
    return icons[name] || null;
}

function get_info(title){
    const info = {
        // Salazar Building Information
        "King Coffee": `
            <div class="popup-content">
                <h3>King Coffee</h3>
                <p>Cafe with coffee drinks, pastries, snacks, and food.</p>
                <img src="../Resources/Images/KingCoffee.png" alt="King Coffee">
                <h4>Operation Hours:</h4>
                <ul>
                    <li><strong>Monday - Thursday:</strong> 8:00 AM - 7:00 PM</li>
                    <li><strong>Friday:</strong> 8:00 AM - 1:00 PM</li>
                    <li><strong>Saturday:</strong> Closed</li>
                    <li><strong>Sunday:</strong> Closed</li>
                </ul>
            </div>`,
        // Library Building Information
        "Kennedy Library":`
                    <div class="popup-content">
                        <h3>Kennedy Library</h3>
                        <p>Library information goes here.</p>
                        <img src="../Resources/Images/Library.webp" alt="Library" style="width: 100%; height: auto;">
                        <h4>Business Hours:</h4>
                        <ul>
                            <li><strong>Monday - Thursday:</strong> 8:00 AM - 5:00 PM</li>
                            <li><strong>Friday:</strong> 8:00 AM - 10:00 PM</li>
                            <li><strong>Saturday:</strong> 10:00 AM - 6:00 PM</li>
                            <li><strong>Sunday:</strong> Closed</li>
                        </ul>
                    </div>`,
        "Everytable": `
                    <div class="popup-content">
                        <h3></h3>
                        <p>Healthy food such as salads, breakfast, and pastries.</p>
                        <img src="../Resources/Images/Everytable.webp" alt="Everytable" class="responsive-img">
                        <h4>Business Hours:</h4>
                        <ul>
                            <li><strong>Monday - Thursday:</strong> 8:00 AM - 8:00 PM</li>
                            <li><strong>Friday:</strong> 8:00 AM - 4:00 PM</li>
                            <li><strong>Saturday:</strong> Closed</li>
                            <li><strong>Sunday:</strong> Closed</li>
                        </ul>
                    </div>`,
        "Cafe 47":`
            <div class="popup-content">
                <h3></h3>
                <p>Cafe with coffee drinks, pastries, snacks and food</p>
                <img src="../Resources/Images/cafe47.JPG" alt="" class="responsive-img">
                <h4>Business Hours:</h4>
                <ul>
                    <li><strong>Monday - Thursday:</strong> 8:00 AM - 4:00 PM</li>
                    <li><strong>Friday:</strong> 8:00 AM - 12:00 PM</li>
                    <li><strong>Saturday:</strong> Closed</li>
                    <li><strong>Sunday:</strong> Closed</li>
                </ul>
            </div>
            `,
            "Panda Express":`
            <div class="popup-content">
                <h3></h3>
                <p>Panda Express offers a variety of American Chinese cuisine.</p>
                <img src="../Resources/Images/pandaexpress.JPEG" alt="" class="responsive-img">
                <h4>Business Hours:</h4>
                <ul>
                    <li><strong>Monday - Thursday:</strong> 8:30 AM - 7:00 PM</li>
                    <li><strong>Friday:</strong> 8:30 AM - 3:00 PM</li>
                    <li><strong>Saturday:</strong> Closed</li>
                    <li><strong>Sunday:</strong> Closed</li>
                </ul>
            </div>
          `,
        "Carl's Jr":`
            <div class="popup-content">
                <h3></h3>
                <p>Carl's Jr offers a variety of American fast food such as hamburgers, fries and soda.</p>
                <img src="../Resources/Images/carls_jr.PNG" alt="" class="responsive-img">
                <h4>Business Hours:</h4>
                <ul>
                    <li><strong>Monday - Thursday:</strong> 7:00 AM - 7:00 PM</li>
                    <li><strong>Friday:</strong> 7:00 AM - 4:00 PM</li>
                    <li><strong>Saturday:</strong> Closed</li>
                    <li><strong>Sunday:</strong> Closed</li>
                </ul>
            </div>
          `,
          "El Pollo Loco":`
          <div class="popup-content">
              <h3></h3>
              <p>El Pollo Loco prepares primarily Mexican chicken entrees, described as "citrus-marinated and fire-grilled." 
              Also offers Mexican-style food, such as tacos, burritos, enchiladas, and quesadillas.</p>
              <img src="../Resources/Images/El Pollo Loco.jpg" alt="" class="responsive-img">
              <h4>Business Hours:</h4>
              <ul>
                  <li><strong>Monday - Thursday:</strong> 9:00 AM - 7:00 PM</li>
                  <li><strong>Friday:</strong> 9:00 AM - 2:00 PM</li>
                  <li><strong>Saturday:</strong> Closed</li>
                  <li><strong>Sunday:</strong> Closed</li>
              </ul>
          </div>
        `,
        "Diablo Grill":`
          <div class="popup-content">
              <h3></h3>
              <p>Diablo Grill .</p>
              <img src="../Resources/Images/carls_jr.JPEG" alt="" class="responsive-img">
              <h4>Business Hours:</h4>
              <ul>
                  <li><strong>Monday - Friday:</strong> 8:00 AM - 1:30 PM</li>
                  <li><strong>Saturday:</strong> Closed</li>
                  <li><strong>Sunday:</strong> Closed</li>
              </ul>
          </div>
        `,
        "The University Club":`
          <div class="popup-content">
              <h3></h3>
              <p>Diablo Grill .</p>
              <img src="../Resources/Images/carls_jr.JPEG" alt="" class="responsive-img">
              <h4>Business Hours:</h4>
              <ul>
                  <li><strong>Monday - Thursday</strong> 11:30 AM - 1:30 PM</li>
                  <li><strong>Friday:</strong> Closed</li>
                  <li><strong>Saturday:</strong> Closed</li>
                  <li><strong>Sunday:</strong> Closed</li>
              </ul>
          </div>
        `,
        "The Spot":`
          <div class="popup-content">
              <h3></h3>
              <p></p>
              <img src="../Resources/Images/The Spot.jpg" alt="" class="responsive-img">
              <h4>Business Hours:</h4>
              <ul>
                  <li><strong>Monday - Thursday</strong> 9:00 AM - 3:00 PM</li>
                  <li><strong>Friday:</strong> Closed</li>
                  <li><strong>Saturday:</strong> Closed</li>
                  <li><strong>Sunday:</strong> Closed</li>
              </ul>
          </div>`
    }

    return info[title] || null
}

function getAllAmenities() {
    return {
        // Salazar Building Information
        "King Coffee": `
            <div class="popup-content">
                <h3>King Coffee</h3>
                <p>Cafe with coffee drinks, pastries, snacks, and food.</p>
                <img src="../Resources/Images/KingCoffee.png" alt="King Coffee">
                <h4>Operation Hours:</h4>
                <ul>
                    <li><strong>Monday - Friday:</strong> 7:30 AM - 5:00 PM</li>
                    <li><strong>Saturday:</strong> Closed</li>
                    <li><strong>Sunday:</strong> Closed</li>
                </ul>
            </div>`,
        // Library Building Information
        "Kennedy Library":`
                    <div class="popup-content">
                        <h3>Kennedy Library</h3>
                        <p>Library information goes here.</p>
                        <img src="../Resources/Images/Library.webp" alt="Library" style="width: 100%; height: auto;">
                        <h4>Business Hours:</h4>
                        <ul>
                            <li><strong>Monday - Thursday:</strong> 8:00 AM - 5:00 PM</li>
                            <li><strong>Friday:</strong> 8:00 AM - 10:00 PM</li>
                            <li><strong>Saturday:</strong> 10:00 AM - 6:00 PM</li>
                            <li><strong>Sunday:</strong> Closed</li>
                        </ul>
                    </div>`,
        "Everytable": `
                    <div class="popup-content">
                        <h3></h3>
                        <p>Healthy food such as salads, breakfast, and pastries.</p>
                        <img src="../Resources/Images/Everytable.webp" alt="Everytable" class="responsive-img">
                        <h4>Business Hours:</h4>
                        <ul>
                            <li><strong>Monday - Thursday:</strong> 8:00 AM - 8:00 PM</li>
                            <li><strong>Friday:</strong> 8:00 AM - 4:00 PM</li>
                            <li><strong>Saturday:</strong> Closed</li>
                            <li><strong>Sunday:</strong> Closed</li>
                        </ul>
                    </div>`,
        "Cafe 47":`
            <div class="popup-content">
                <h3></h3>
                <p>Cafe with coffee drinks, pastries, snacks and food</p>
                <img src="../Resources/Images/cafe47.JPG" alt="" class="responsive-img">
                <h4>Business Hours:</h4>
                <ul>
                    <li><strong>Monday - Thursday:</strong> 8:00 AM - 4:00 PM</li>
                    <li><strong>Friday:</strong> 8:00 AM - 12:00 PM</li>
                    <li><strong>Saturday:</strong> Closed</li>
                    <li><strong>Sunday:</strong> Closed</li>
                </ul>
            </div>
            `
    }
}