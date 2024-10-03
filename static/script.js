// Get references to HTML elements for interaction
const descriptionContainer = document.getElementById('description');
const geocodeForm = document.getElementById('geocode-form');
const resultDiv = document.getElementById('result');

// Initialize Leaflet map centered on the Philippines with zoom level 6
const map = L.map('map').setView([12.8797, 121.7740], 6);

// Add OpenStreetMap tiles to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize a marker variable to store the marker and ensure it can be removed later
let marker;

// Event listener for form submission
geocodeForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from submitting the usual way
    const city = document.getElementById('city').value; // Get city input value

    // Send the city to the server using fetch
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // Send the form data as URL encoded
        },
        body: `city=${city}` // Send the city name in the body of the POST request
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Parse the response as JSON if the request was successful
        } else {
            throw new Error('Network response was not ok'); } }) .then(data => { resultDiv.innerHTML = ''; // Clear previous results
                if (data.error) {
                    resultDiv.innerHTML = `<p>${data.error}</p>`; // Display error message if something went wrong
                } else {
                    resultDiv.innerHTML = `
                        <p>Formatted Address: ${data.formatted}</p>
                        <p>Latitude: ${data.latitude}</p>
                        <p>Longitude: ${data.longitude}</p>
                        <p>Components: ${JSON.stringify(data.components)}</p>
                        <p>Confidence: ${data.confidence}</p>
                    `;
            
                    // Update the map's center to the new location
                    map.setView([data.latitude, data.longitude], 12);
            
                    // Remove existing marker if present
                    if (marker) {
                        map.removeLayer(marker);
                    }
            
                    // Add
                }
            })})            
