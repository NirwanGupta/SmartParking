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
import { axiosInstance } from "../lib/axios";

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
  { lat: 29.398928, lng: 76.977081 }, // Las Vegas
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
  try {
    let minDistance = Number.MAX_VALUE;
    let closestLocation = null;

    // Iterate over each location and make a separate API call
    for (const loc of locations) {
      const response = await axiosInstance.post("/distance", {
        origin: `${lat},${lng}`,
        destination: `${loc.lat},${loc.lng}`,
      });

      if (response.data && response.data.rows.length > 0) {
        const distanceElement = response.data.rows[0].elements[0]; // Extract the distance info

        if (distanceElement.status === "OK" && distanceElement.distance.value < minDistance) {
          minDistance = distanceElement.distance.value;
          closestLocation = loc;
        }
      }
    }

    if (closestLocation) {
      setDestination(`${closestLocation.lat},${closestLocation.lng}`);
      toast.success(`Closest location found! Distance: ${(minDistance / 1000).toFixed(2)} km`);
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
