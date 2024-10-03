const descriptionContainer = document.getElementById('description');
const geocodeForm = document.getElementById('geocode-form');
const resultDiv = document.getElementById('result');
const mapContainer = document.getElementById('map-container');
const map = L.map('map').setView([12.8797, 121.7740], 6); // Initial center and zoom

// Load tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

geocodeForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from submitting normally
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
            // Display results in a structured format
            resultDiv.innerHTML = `
                <div class="result-card">
                    <h2>Geocoding Result</h2>
                    <p><strong>City:</strong> ${data.formatted}</p>
                    <p><strong>Latitude:</strong> ${data.latitude}</p>
                    <p><strong>Longitude:</strong> ${data.longitude}</p>
                    <p><strong>Confidence:</strong> ${data.confidence}</p>
                </div>
            `;

            // Animate the result div to fade in
            resultDiv.classList.add('visible'); 

            // Animate the map to the new location using flyTo
            map.flyTo([data.latitude, data.longitude], 12, {
                duration: 2 // Duration of the animation in seconds
            });

            // Add a marker to the map at the city location
            L.marker([data.latitude, data.longitude]).addTo(map)
                .bindPopup(`City: ${data.formatted}`) // Bind a popup to the marker
                .openPopup(); // Open the popup immediately
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        resultDiv.innerHTML = `<p>Error: Unable to process request.</p>`;
    });
})