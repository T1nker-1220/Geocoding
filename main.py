from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__, static_folder='static')  # Set the static folder

# Your OpenCage API key
api_key = "498177dbd9e64c509f3c883626ee4629"

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        city = request.form.get('city')
        if city:
            result = geocode_city(city, api_key)
            return jsonify(result)
        else:
            return jsonify({'error': 'Please enter a city'}), 400
    else:
        return render_template('maps.html')

def geocode_city(city, api_key):
    """Geocodes a city name using the OpenCage API."""

    url = f"https://api.opencagedata.com/geocode/v1/json?q={city},Philippines&key={api_key}&pretty=1"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        if 'results' in data and data['results']:
            result = data['results'][0]
            return {
                'latitude': result['geometry']['lat'],
                'longitude': result['geometry']['lng'],
                'formatted': result['formatted'],
                'components': result['components'],
                'confidence': result['confidence']
            }
        else:
            return {'error': 'City not found'}
    else:
        return {'error': 'API request failed'}

if __name__ == '__main__':
    app.run(debug=True)