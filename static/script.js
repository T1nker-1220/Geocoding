const descriptionContainer = document.getElementById('description');
const geocodeForm = document.getElementById('geocode-form');
const resultDiv = document.getElementById('result');
const mapContainer = document.getElementById('map-container');

// Initialize the map with center and zoom level
const map = L.map('map').setView([12.8797, 121.7740], 6);

// Add tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Handle form submission
geocodeForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission

    const city = document.getElementById('city').value; // Get city input value

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // Set content type
        },
        body: `city=${encodeURIComponent(city)}` // Include city in the request body
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Parse the JSON response
        } else {
            throw new Error('Network response was not ok'); // Handle errors
        }
    })
    .then(data => {
        resultDiv.innerHTML = ''; // Clear previous results

        // Check for errors in the response
        if (data.error) {
            resultDiv.innerHTML = `<p>${data.error}</p>`; // Display error message
        } else {
            // Display the city information
            document.getElementById('city-name').textContent = data.formatted; // Set city name
            document.getElementById('city-description').textContent = `Latitude: ${data.latitude}, Longitude: ${data.longitude}`; // Set city description

            // Show the description container
            descriptionContainer.classList.remove('hidden');
            descriptionContainer.classList.add('show');

            // Center the map on the searched city
            map.setView([data.latitude, data.longitude], 12); // Adjust zoom as needed
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error); // Log error
        resultDiv.innerHTML = `<p>Error: Unable to process request.</p>`; // Display error message
    });
});
