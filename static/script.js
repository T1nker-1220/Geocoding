// Get references to HTML elements
const descriptionContainer = document.getElementById('description');
const cityNameSpan = document.getElementById('city-name');
const cityDescriptionSpan = document.getElementById('city-description');
const geocodeForm = document.getElementById('geocode-form');
const resultDiv = document.getElementById('result');

// Initialize Leaflet map centered on the Philippines
const map = L.map('map').setView([12.8797, 121.7740], 6);

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Variable to store the map marker
let marker;

// Handle form submission
geocodeForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    const city = document.getElementById('city').value; // Get the city from the input field

    // Fetch the geocode data from the server
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `city=${city}`
    })
    .then(response => response.json())
    .then(data => {
        resultDiv.innerHTML = ''; // Clear previous results

        if (data.error) {
            resultDiv.innerHTML = `<p>${data.error}</p>`; // Display error message
        } else {
            cityNameSpan.innerText = data.components.city || data.components.town || city; // Display city name
            cityDescriptionSpan.innerText = data.formatted; // Display formatted address

            // Update map view to the new city location
            map.setView([data.latitude, data.longitude], 12);

            // Remove existing marker if present
            if (marker) map.removeLayer(marker);

            // Add a new marker to the map at the city's coordinates
            marker = L.marker([data.latitude, data.longitude]).addTo(map)
                .bindPopup(`<b>${data.formatted}</b>`).openPopup(); // Bind a popup to the marker
        }
    })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = `<p>Error: Unable to process request.</p>`; // Display error message
    });
});
