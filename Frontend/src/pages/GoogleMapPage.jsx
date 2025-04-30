import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
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
  const [userLocation, setUserLocation] = useState(null); // user's current lat/lng
  const [destinationInput, setDestinationInput] = useState(""); // text input
  const [destinationAddress, setDestinationAddress] = useState(""); // address to pass to Directions API
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedParkingID, setSelectedParkingID] = useState(null);

  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const coordString = `${coords.latitude},${coords.longitude}`;
          setUserLocation({ lat: coords.latitude, lng: coords.longitude });
          setOrigin(coordString);
          setDestinationInput(coordString);
        },
        (err) => {
          console.error(err);
          toast.error("Unable to retrieve your location.");
        }
      );
    }
  }, []);

  // Fetch all parking locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosInstance.get("/Parking/getAllParking");
        setLocations(res.data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error("Failed to load parking locations.");
      }
    };
    fetchLocations();
  }, []);

  // Find closest parking to entered destination
  const findClosestLocation = async (sourceStr) => {
    if (!sourceStr || locations.length === 0) return;
    try {
      const distancePromises = locations.map((loc) =>
        axiosInstance
          .post("/distance/distance", {
            origin: sourceStr,
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
        const { locationId, address } = closestData.loc;
        setSelectedParkingID(locationId);
        setSelectedBuildingId(locationId);
        setDestinationAddress(address); // NEW: set destination to address
        toast.success(`Closest parking found: ${(closestData.distance / 1000).toFixed(2)} km`);
        console.log("Closest parking location:", closestData.loc.address);
      }
    } catch (error) {
      console.error("Error finding closest location:", error);
      toast.error("Failed to find nearest parking.");
    }
  };

  // Handle search button click
  const handleSearch = async () => {
    if (!destinationInput.trim()) {
      toast.error("Please enter a destination.");
      return;
    }
    setLoading(true);
    await findClosestLocation(destinationInput.trim());
    setLoading(false);
  };

  // Fetch directions once both origin and destination are ready
  useEffect(() => {
    if (origin && destinationAddress) {
      const fetchDirections = async () => {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: origin,
            destination: destinationAddress, // destination is ADDRESS now
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result) {
              setDirectionsResponse(result);
            } else {
              console.error("Directions request failed:", status);
              toast.error("Failed to fetch route.");
            }
          }
        );
      };
      fetchDirections();
    }
  }, [origin, destinationAddress]);

  return (
    <div className="flex flex-col items-center p-6">
      {/* Title and Description */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Find Nearest Parking</h2>
        <p className="text-base-content/60">
          Enter a destination to find the nearest parking spot.
        </p>
      </div>

      {/* Search Card */}
      <div className="card w-full max-w-lg bg-base-100 shadow-xl p-6 mt-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Destination</span>
          </label>
          <input
            type="text"
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter destination or leave blank for nearby"
          />
          {selectedParkingID && (
            <div className="mt-2 text-sm text-base-content/70">
              <span className="font-medium">Selected Parking ID:</span> {selectedParkingID}
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="btn btn-primary mt-6 w-full"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Find Nearest Parking"}
        </button>
      </div>

      {/* Google Map */}
      <div className="w-full max-w-4xl mt-8 rounded-xl overflow-hidden shadow-lg">
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || defaultCenter}
            zoom={10}
          >
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Go to Book Slot */}
      <button
        onClick={() => navigate(`/parkings/?id=${selectedParkingID}`)}
        className="btn btn-accent mt-6"
        disabled={!selectedParkingID}
      >
        Go to Book Slot
      </button>
    </div>
  );
};

export default GoogleMapPage;
