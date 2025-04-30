import React, { useEffect, useState } from "react";
import { Car, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

const AllParkingsUser = () => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAllParking } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParkingData = async () => {
      const response = await getAllParking();
      console.log("All Parkings:", response);
      if (response && response.locations) {
        setParkingSlots(response.locations);
      }
      setLoading(false);
    };
    fetchParkingData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-6 sm:p-12 w-full">
      <div className="w-full max-w-3xl space-y-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Available Parking Slots</h1>
            <p className="text-base-content/60">Find your nearest available parking slots</p>
          </div>
        </div>

        {/* Loading or Slot List */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : parkingSlots.length === 0 ? (
          <p className="text-base-content/60">No parking slots available.</p>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {parkingSlots.map((slot) => (
              <div
                key={slot.locationId}
                className="bg-white shadow-md rounded-xl p-6 border border-gray-200 w-full"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{slot.buildingName}</h3>
                    <p className="text-sm text-gray-500">{slot.address}</p>
                    <div className="mt-2 text-sm text-gray-600">
                      <p><strong>Latitude:</strong> {slot.lat}</p>
                      <p><strong>Longitude:</strong> {slot.lng}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/selectedParking/?id=${slot.locationId}&status=${"Book Now"}`)}
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
  );
};

export default AllParkingsUser;
