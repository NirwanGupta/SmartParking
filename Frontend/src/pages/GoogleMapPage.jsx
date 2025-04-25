import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
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

const GoogleMapPage = () => {
  const { setSelectedBuildingId } = useAuthStore();
  const navigate = useNavigate();

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
        ({ coords }) => {
          setUserLocation({ lat: coords.latitude, lng: coords.longitude });
          setOrigin(`${coords.latitude},${coords.longitude}`);
        },
        (err) => {
          console.error(err);
          toast.error("Unable to retrieve your location.");
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosInstance.get("/Parking/getAllParking");
        setLocations(res.data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    console.log(locations);
    if (locations.length > 0 && userLocation) {
      findClosestLocation(userLocation.lat, userLocation.lng);
    }
  }, [locations, userLocation]);

  const findClosestLocation = async (lat, lng) => {
    try {
      const originStr = `${lat},${lng}`;
      const distancePromises = locations.map((loc) =>
        axiosInstance
          .post("/parking/distance", {
            origin: originStr,
            destination: `${loc.lat},${loc.lng}`,
          })
          .then((response) => ({ response, loc }))
      );

      const results = await Promise.all(distancePromises);

      const closestData = results
        .map(({ response, loc }) => {
          const element = response?.data?.rows?.[0]?.elements?.[0];
          return element?.status === "OK"
            ? { distance: element.distance.value, loc }
            : null;
        })
        .filter(Boolean)
        .reduce(
          (min, curr) => (curr.distance < min.distance ? curr : min),
          { distance: Number.MAX_VALUE, loc: null }
        );

      if (closestData.loc) {
        const { lat, lng, address, locationId } = closestData.loc;
        setDestination(`${lat},${lng}`);
        toast.success(`Closest parking: ${(closestData.distance / 1000).toFixed(2)} km`);

        setSelectedParkingID(locationId);
        setSelectedBuildingId(locationId);
      }
    } catch (error) {
      console.error("Error fetching distances:", error);
      toast.error("Failed to find nearest parking.");
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
        <p className="text-base-content/60">Enter your location to find the nearest parking spot.</p>
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
            <span className="label-text font-medium">Destination</span>
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="input input-bordered w-full"
          />
          {selectedParkingID && (
            <div className="mt-2 text-sm text-base-content/70">
              <span className="font-medium">Selected Parking ID:</span> {selectedParkingID}
            </div>
          )}
        </div>

        <button onClick={handleSearch} className="btn btn-primary mt-6 w-full" disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Find Route"}
        </button>
      </div>

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
