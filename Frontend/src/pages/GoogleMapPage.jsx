import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MapPin, Route, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-base-content/40" />
            </div>
            <input
              type="text"
              placeholder="Enter Source"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text font-medium">Destination</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Route className="h-5 w-5 text-base-content/40" />
            </div>
            <input
              type="text"
              placeholder="Enter Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
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
                options={{
                  origin,
                  destination,
                  travelMode: "DRIVING",
                }}
                callback={(response, status) => {
                  setLoading(false);
                  if (status === "OK") {
                    setDirectionsResponse(response);
                    // toast.success("Route found successfully!");
                  } else {
                    // toast.error("Error fetching directions: " + status);
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
