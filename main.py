from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__, static_folder='static')  # Initialize Flask app and set static folder for CSS/JS files

# OpenCage API key for geocoding
api_key = "498177dbd9e64c509f3c883626ee4629"

@app.route('/', methods=['GET', 'POST'])
def index():
    """Handles both GET and POST requests for the homepage."""
    if request.method == 'POST':
        city = request.form.get('city')  # Get the city entered by the user in the form
        if city:
            result = geocode_city(city, api_key)  # Call the geocoding function to fetch city details
            return jsonify(result)  # Return the result as JSON to be handled by the front-end
        else:
            return jsonify({'error': 'Please enter a city'}), 400  # Return an error if city is empty
    else:
        return render_template('maps.html')  # Render the HTML template for the user interface on GET request

def geocode_city(city, api_key):
    """Fetches the latitude and longitude of a city using the OpenCage API."""
    url = f"https://api.opencagedata.com/geocode/v1/json?q={city},Philippines&key={api_key}&pretty=1"
    response = requests.get(url)  # Send a GET request to the OpenCage API

    if response.status_code == 200:
        data = response.json()  # Parse the API response as JSON
        if 'results' in data and data['results']:  # Check if results are returned
            result = data['results'][0]  # Get the first result (most relevant one)
            return {
                'latitude': result['geometry']['lat'],  # Extract latitude
                'longitude': result['geometry']['lng'],  # Extract longitude
                'formatted': result['formatted'],  # Extract formatted address
                'components': result['components'],  # Extract address components (e.g., city, region)
                'confidence': result['confidence']  # Extract confidence score of the geocode result
            }
        else:
            return {'error': 'City not found'}  # Handle case where no results are found
    else:
        return {'error': 'API request failed'}  # Handle case of API failure

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask app in debug mode
