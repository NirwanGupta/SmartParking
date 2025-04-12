import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom"; // 🆕 Import

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
  const { setSelectedBuildingId } = useAuthStore();
  const navigate = useNavigate(); // 🆕 Hook for navigation

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedParkingID, setSelectedParkingID] = useState(null);

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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosInstance.get("/parking/getAllParking");
        setLocations(res.data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (locations.length > 0 && userLocation) {
      findClosestLocation(userLocation.lat, userLocation.lng);
    }
  }, [locations, userLocation]);

  const findClosestLocation = async (lat, lng) => {
    try {
      let minDistance = Number.MAX_VALUE;
      let closestLocation = null;

      for (const loc of locations) {
        const response = await axiosInstance.post("/distance", {
          origin: `${lat},${lng}`,
          destination: `${loc.lat},${loc.lng}`,
        });

        if (response.data && response.data.rows.length > 0) {
          const distanceElement = response.data.rows[0].elements[0];

          if (distanceElement.status === "OK" && distanceElement.distance.value < minDistance) {
            minDistance = distanceElement.distance.value;
            closestLocation = loc;
          }
        }
      }

      if (closestLocation) {
        setDestination(`${closestLocation.lat},${closestLocation.lng}`);
        toast.success(`Closest location found! Distance: ${(minDistance / 1000).toFixed(2)} km`);

        if (closestLocation.address) {
          setSelectedParkingID(closestLocation.locationId);
          setSelectedBuildingId(closestLocation.locationId);
        } else {
          await reverseGeocode(closestLocation.lat, closestLocation.lng);
          setSelectedParkingID(0);
        }
      }
    } catch (error) {
      console.error("Error fetching distances:", error);
      toast.error("Failed to fetch distances.");
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
      );
      if (res.data.results && res.data.results.length > 0) {
        return res.data.results[0].formatted_address;
      }
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
    }
    return null;
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
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text font-medium">Nearest Destination</span>
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="input input-bordered w-full"
          />
          {selectedParkingID && (
            <div className="mt-2 text-sm text-base-content/70">
              <span className="font-medium">Selected Address:</span> {selectedParkingID}
            </div>
          )}
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

      {/* 🆕 Book Slot Button */}
      <button
        onClick={() => navigate("/parkings")}
        className="btn btn-accent mt-6"
        disabled={!selectedParkingID}
      >
        Go to Book Slot
      </button>
    </div>
  );
};

export default GoogleMapPage;
