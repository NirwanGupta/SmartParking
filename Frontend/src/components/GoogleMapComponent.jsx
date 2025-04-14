// components/LocationPicker.js
import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 28.6139, // Default center (e.g., Delhi)
  lng: 77.2090,
};

const LocationPicker = ({ onLocationSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // or process.env.REACT_APP_...
  });

  const [marker, setMarker] = useState(null);

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarker({ lat, lng });

    // Fetch address using reverse geocoding
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    const address = data.results[0]?.formatted_address || '';

    onLocationSelect({ lat, lng, address });
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onClick={handleMapClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
};

export default LocationPicker;
