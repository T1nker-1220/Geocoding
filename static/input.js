const geocodeForm = document.getElementById('geocode-form');
const resultDiv = document.getElementById('result');

geocodeForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

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
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        resultDiv.innerHTML = `<p>Error: Unable to process request.</p>`;
    });
});