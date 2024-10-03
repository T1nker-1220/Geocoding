# apps.py

import requests

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

# Example usage:
api_key = 'YOUR_API_KEY'
latitude = 51.5074
longitude = 0.1278

result = reverse_geocode(latitude, longitude, api_key)
print(result) 