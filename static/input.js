const descriptionContainer = document.getElementById('description');
const geocodeForm = document.getElementById('geocode-form');
const resultDiv = document.getElementById('result');
const mapContainer = document.getElementById('map-container');
const map = L.map('map').setView([12.8797, 121.7740], 6); // Initial center and zoom

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

geocodeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const locationInput = document.getElementById('location-input');

    const city = document.getElementById('city').value;

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `city=${city}`
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .then(data => {
        resultDiv.innerHTML = ''; // Clear previous results
        if (data.error) {
            resultDiv.innerHTML = `<p>${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `
                <p>Formatted Address: ${data.formatted}</p>
                <p>Latitude: ${data.latitude}</p>
                <p>Longitude: ${data.longitude}</p>
                <p>Components: ${JSON.stringify(data.components)}</p>
                <p>Confidence: ${data.confidence}</p>
            `;

            // Center the map on the searched city
            map.setView([data.latitude, data.longitude], 12); // Adjust zoom as needed
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        resultDiv.innerHTML = `<p>Error: Unable to process request.</p>`;
    });
});