// Get DOM elements from the HTML
const descriptionContainer = document.getElementById('description'); // Container for city description
const geocodeForm = document.getElementById('geocode-form'); // The form for city input
const resultDiv = document.getElementById('result'); // Div to display results
const mapContainer = document.getElementById('map-container'); // Container for the map

// Initialize the Leaflet map centered on the Philippines
const map = L.map('map').setView([12.8797, 121.7740], 6); // Default view and zoom level

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map); // This adds the tiles to the map

// Listen for the form submission event
geocodeForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const city = document.getElementById('city').value.trim(); // Get the value of the input field and trim whitespace

    // Check if the input is empty and display a message if so
    if (!city) {
        resultDiv.innerHTML = '<p>Please enter a valid city name.</p>'; // Inform the user to input a city
        return; // Exit the function
    }

    // Fetch geocoding data from the Flask backend
    fetch('/', {
        method: 'POST', // Use POST method
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // Specify the content type
        },
        body: `city=${encodeURIComponent(city)}` // Encode the city name to safely include it in the request
    })
    .then(response => {
        if (response.ok) { // Check if the response is OK (status code 200)
            return response.json(); // Parse JSON response
        } else {
            throw new Error('Network response was not ok'); // Throw an error for bad responses
        }
    })
    .then(data => {
        // Clear previous results from the display
        resultDiv.innerHTML = ''; 

        // Check for errors in the API response
        if (data.error) {
            resultDiv.innerHTML = `<p>${data.error}</p>`; // Display error message
        } else {
            // Display the geocoding results in a structured format
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
        // Catch and handle any errors that occur during fetch
        console.error('There was a problem with the fetch operation:', error);
        resultDiv.innerHTML = `<p>Error: Unable to process request. ${error.message}</p>`; // Display the error message
    });
});
