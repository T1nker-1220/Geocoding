from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__, static_folder='static')  # Flask app initialized, static folder defined

# OpenCage API key for geocoding
api_key = "498177dbd9e64c509f3c883626ee4629"

@app.route('/', methods=['GET', 'POST'])
def index():
    """Handles both GET and POST requests for the root URL."""
    if request.method == 'POST':
        city = request.form.get('city')  # Get the city from the form data
        if city:
            result = geocode_city(city, api_key)  # Perform geocoding using the OpenCage API
            return jsonify(result)  # Return the result as JSON
        else:
            return jsonify({'error': 'Please enter a city'}), 400  # Error if no city provided
    else:
        return render_template('maps.html')  # Render the main HTML page

def geocode_city(city, api_key):
    """Geocodes a city name using the OpenCage API."""
    url = f"https://api.opencagedata.com/geocode/v1/json?q={city},Philippines&key={api_key}&pretty=1"
    response = requests.get(url)  # API call to OpenCage

    if response.status_code == 200:  # If the request is successful
        data = response.json()
        if 'results' in data and data['results']:  # Check if results were returned
            result = data['results'][0]  # Get the first result
            return {
                'latitude': result['geometry']['lat'],  # Extract latitude
                'longitude': result['geometry']['lng'],  # Extract longitude
                'formatted': result['formatted'],  # Extract formatted address
                'components': result['components'],  # Extract address components
                'confidence': result['confidence']  # Extract confidence level
            }
        else:
            return {'error': 'City not found'}  # If no results, return error
    else:
        return {'error': 'API request failed'}  # Handle API request failure

if __name__ == '__main__':
    app.run(debug=True)  # Run Flask app in debug mode
