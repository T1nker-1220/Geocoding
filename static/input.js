function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7128, lng: -74.0060 }, // New York City
        zoom: 10
    });

    // Add a marker
    const marker = new google.maps.Marker({
        position: { lat: 40.7128, lng: -74.0060 },
        map: map,
        icon: '/static/images/marker.png' // Customize with your marker image
    });
}