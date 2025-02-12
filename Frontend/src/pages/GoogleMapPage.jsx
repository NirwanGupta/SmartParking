import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MapPin, Route, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

const locations = [
  { lat: 37.7749, lng: -122.4194 }, // San Francisco
  { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  { lat: 36.1699, lng: -115.1398 }, // Las Vegas
];

const GoogleMapPage = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setOrigin(`${latitude},${longitude}`);
          findClosestLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not retrieve your location. Please enter it manually.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  }, []);

  const findClosestLocation = async (lat, lng) => {
    const destinations = locations.map((loc) => `${loc.lat},${loc.lng}`).join("|");
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat},${lng}&destinations=${destinations}&key=${API_KEY}`;
    
    try {
      const response = await axios.get(url);
      const distances = response.data.rows[0].elements;
      let minDistance = Number.MAX_VALUE;
      let closestLocation = null;
      
      distances.forEach((element, index) => {
        if (element.status === "OK" && element.distance.value < minDistance) {
          minDistance = element.distance.value;
          closestLocation = locations[index];
        }
      });
      
      if (closestLocation) {
        setDestination(`${closestLocation.lat},${closestLocation.lng}`);
        toast.success("Closest location found!");
      } else {
        toast.error("No nearby locations found.");
      }
    } catch (error) {
      console.error("Error fetching distances:", error);
      toast.error("Failed to fetch distances.");
    }
  };

  const handleSearch = () => {
    if (!origin.trim() || !destination.trim()) {
      toast.error("Please enter both source and destination.");
      return;
    }
    setLoading(true);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Find the Shortest Path</h2>
        <p className="text-base-content/60">Enter your starting point and destination.</p>
      </div>

      <div className="card w-full max-w-lg bg-base-100 shadow-xl p-6 mt-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Source</span>
          </label>
          <div className="relative">
            <input type="text" value={origin} readOnly className="input input-bordered w-full" />
          </div>
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text font-medium">Nearest Destination</span>
          </label>
          <div className="relative">
            <input type="text" value={destination} readOnly className="input input-bordered w-full" />
          </div>
        </div>

        <button onClick={handleSearch} className="btn btn-primary mt-6 w-full" disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Find Route"}
        </button>
      </div>

      {/* Map Section */}
      <div className="w-full max-w-4xl mt-8 rounded-xl overflow-hidden shadow-lg">
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={userLocation || defaultCenter} zoom={10}>
            {origin && destination && (
              <DirectionsService
                options={{ origin, destination, travelMode: "DRIVING" }}
                callback={(response, status) => {
                  setLoading(false);
                  if (status === "OK") {
                    setDirectionsResponse(response);
                  }
                }}
              />
            )}
            {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default GoogleMapPage;
