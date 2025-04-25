import React, { useEffect, useState } from "react";
import { Car, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ParkingListOwner = () => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // Initialize navigate hook

  const testData = [
    {
      _id: "loc-1",
      name: "Central Mall Parking",
      address: "123 Market Road, City Center",
      lat: "28.6139",
      lng: "77.2090",
    },
    {
      _id: "loc-2",
      name: "Airport Parking Lot",
      address: "Terminal 3, IGI Airport",
      lat: "28.5562",
      lng: "77.1000",
    },
    {
      _id: "loc-3",
      name: "Tech Park Basement",
      address: "45 Tech Street, Noida",
      lat: "28.5355",
      lng: "77.3910",
    },
    {
      _id: "loc-4",
      name: "Metro Station Parking",
      address: "Blue Line Metro, Sector 18",
      lat: "28.5678",
      lng: "77.3265",
    },
    {
      _id: "loc-5",
      name: "Green Mall Parking",
      address: "Greenfield Avenue",
      lat: "28.4444",
      lng: "77.1234",
    },
    {
      _id: "loc-6",
      name: "Hospital Parking Zone",
      address: "City Hospital, Block B",
      lat: "28.6123",
      lng: "77.2222",
    },
    {
      _id: "loc-7",
      name: "Corporate Tower Lot",
      address: "Tower A, Business Bay",
      lat: "28.6543",
      lng: "77.3456",
    },
    {
      _id: "loc-8",
      name: "Cinema Parking Area",
      address: "Starlight Cinema, Main Road",
      lat: "28.6789",
      lng: "77.2900",
    },
    {
      _id: "loc-9",
      name: "University Parking",
      address: "Block E, University Campus",
      lat: "28.7034",
      lng: "77.1111",
    },
    {
      _id: "loc-10",
      name: "Highway Rest Stop",
      address: "NH8, Rest Zone 5",
      lat: "28.7890",
      lng: "77.4567",
    },
  ];

  useEffect(() => {
    const fetchTestData = () => {
      setLoading(true);
      setTimeout(() => {
        setParkingSlots(testData);
        setLoading(false);
      }, 1000);
    };
    fetchTestData();
  }, []);

  return (
    <div className="h-screen grid lg:grid-cols-1">
      {/* Left Side - Parking Slots */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 w-full">
        <div className="w-full max-w-3xl space-y-8">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
              >
                <Car className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Parking Slots</h1>
              <p className="text-base-content/60">Manage your parking slots</p>
            </div>
          </div>

          {/* Loading or Slot List */}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : parkingSlots.length === 0 ? (
            <p className="text-base-content/60">No parking slots found.</p>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              {parkingSlots.map((slot) => (
                <div
                  key={slot._id}
                  className="bg-white shadow-md rounded-xl p-6 border border-gray-200 w-full"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{slot.name}</h3>
                      <p className="text-sm text-gray-500">{slot.address}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        <p><strong>Latitude:</strong> {slot.lat}</p>
                        <p><strong>Longitude:</strong> {slot.lng}</p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/selectedParking/?id=${slot._id}`)} // Corrected the navigate URL
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkingListOwner;
