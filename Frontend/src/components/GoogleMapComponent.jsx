// components/LocationPicker.js
import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const fallbackCenter = {
  lat: 28.6139, // Delhi (fallback)
  lng: 77.2090,
};

const LocationPicker = ({ onLocationSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [center, setCenter] = useState(fallbackCenter);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // Permission denied or error - keep fallback
        console.warn('Geolocation permission denied. Using fallback location.');
      }
    );
  }, []);

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarker({ lat, lng });

    // Reverse geocoding to get address
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