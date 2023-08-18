document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  des = urlParams.get("title");

  const apiKey = "AIzaSyB7p7Fx-mIlhE6dHiDQNRJbQLVFRIH_ppA";

  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address= ${des}&key=${apiKey}`;

  // Make the API request
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        latitude = location.lat;
        longitude = location.lng;
   
       const map = initMap(location.lat, location.lng);

        // Fetch and display nearby places
        const destinationLocation = new google.maps.LatLng(location.lat, location.lng);
        fetchNearbyPlaces(map, destinationLocation);
        
       
      } else {
        console.error("Geocoding request failed:", data.status);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  
});

// Function to initialize and display a map
function initMap(latitude, longitude) {
  const mapContainer = document.getElementById("map");

  const mapOptions = {
    center: { lat: latitude, lng: longitude },
    zoom: 12, // Adjust the zoom level as needed
  };

  const map = new google.maps.Map(mapContainer, mapOptions);

  // Add a marker for the location
  const marker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: map,
    title: "Destination Location",
  });

  return map;
}

// Function to fetch and display nearby places
function fetchNearbyPlaces(map, location) {
  const placesService = new google.maps.places.PlacesService(map);

  const request = {
    location: location,
    radius: 1500,
    type: "restaurant",
  };

  placesService.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      displayNearbyPlaces(results);
    } else {
      console.error("Nearby places request failed:", status);
    }
  });
}

// Function to display nearby places in the list
function displayNearbyPlaces(places) {
  const placesListContainer = document.getElementById("places-list");

  placesListContainer.innerHTML = "";

  places.forEach((place) => {
    const placeItem = document.createElement("div");
    placeItem.className = "card-panel destination white row nearby-places";
    placeItem.innerHTML = `
       
        <img src="/img/places.png" alt="Nearby places Icon">
        <div class="destination-details">
          <div class="destination-title">${place.name}</div>
          <div class="destination-country">${place.vicinity}</div>
        </div>
    
        `;
    placesListContainer.appendChild(placeItem);
  });
}
