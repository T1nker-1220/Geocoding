from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Your OpenCage API key
api_key = "498177dbd9e64c509f3c883626ee4629" 

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        latitude = float(request.form.get('latitude'))
        longitude = float(request.form.get('longitude'))
        result = reverse_geocode(latitude, longitude, api_key)
        return jsonify(result)
    else:
        return render_template('maps.html')

def reverse_geocode(latitude, longitude, api_key):
    """Reverse geocodes coordinates using the OpenCage API."""

    url = f"https://api.opencagedata.com/geocode/v1/json?q={latitude},{longitude}&key={api_key}&pretty=1"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        if 'results' in data and data['results']:
            result = data['results'][0]
            return {
                'formatted': result['formatted'],
                'components': result['components'],
                'confidence': result['confidence']
            }
        else:
            return {'error': 'No results found'}
    else:
        return {'error': 'API request failed'}

if __name__ == '__main__':
    app.run(debug=True)