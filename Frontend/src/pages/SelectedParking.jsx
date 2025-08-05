import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useOwnerStore } from '../store/useOwnerStore';
import { useAuthStore } from '../store/useAuthStore';

const SelectedParking = () => {
  const { getSingleParking } = useOwnerStore();
  const {role} = useAuthStore();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const status = searchParams.get("status");

  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isOwner = role === 'owner';

  useEffect(() => {
    const fetchParkingDetails = async () => {
      try {
        const response = await getSingleParking(id);
        setParking(response);
        console.log("Parking details:", response);
      } catch (error) {
        console.error("Failed to fetch parking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!parking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-base-content/60">Parking details not found.</p>
      </div>
    );
  }

  const handleChanges = () => {
    navigate(`/owner/add-changes?id=${id}`, { state: { parking } });
  };

  const { latitude, longitude } = parking.coordinates;

  // Variables
  let totalSlots = 0, totalTwoWheelerSlots = 0, totalFourWheelerSlots = 0;
  let totalAvailableSlots = 0, totalAvailableTwoWheelerSlots = 0, totalAvailableFourWheelerSlots = 0;
  let twoWheelerPrice = 0;
  let fourWheelerPrice = 0;

  if (parking.parkingInfo.floors.length > 0) {
    parking.parkingInfo.floors.forEach(floor => {
      totalTwoWheelerSlots += floor.twoWheeler.totalSlots;
      totalFourWheelerSlots += floor.fourWheeler.totalSlots;
      totalAvailableTwoWheelerSlots += (floor.twoWheeler.totalSlots - floor.twoWheeler.occupiedSlots);
      totalAvailableFourWheelerSlots += (floor.fourWheeler.totalSlots - floor.fourWheeler.occupiedSlots);
    });
    totalSlots = totalTwoWheelerSlots + totalFourWheelerSlots;
    totalAvailableSlots = totalAvailableTwoWheelerSlots + totalAvailableFourWheelerSlots;
    twoWheelerPrice = parking.parkingInfo.floors[0].twoWheeler.ratePerHour;
    fourWheelerPrice = parking.parkingInfo.floors[0].fourWheeler.ratePerHour;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{parking.buildingName}</h1>
          <p className="text-base-content/60">{parking.organization} - Find it on map</p>
        </div>

        {/* Parking Area Details */}
        <div className="card bg-base-100 shadow p-6 space-y-6 mx-auto w-full">
          
          {/* Basic Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Parking Information</h2>
            <p><span className="font-semibold">Address:</span> {parking.address}</p>
            <p><span className="font-semibold">Coordinates:</span> {latitude}, {longitude}</p>
          </div>

          {/* Google Map */}
          <div className="w-full h-64 rounded-lg overflow-hidden shadow">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={`https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`}
              title="Parking Location"
              allowFullScreen
            ></iframe>
          </div>

          {/* Slots and Price Info */}
          <div className="space-y-8 mt-6">
            <h2 className="text-2xl font-semibold text-center mb-6">Parking Slot Details</h2>

            {parking.parkingInfo.floors.length === 0 ? (
              <div className="text-center text-base-content/60">
                Parking slot information not available yet.
              </div>
            ) : (
              <>
                {/* Total Slots */}
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-lg shadow w-64">
                    <span className="text-xl font-semibold">Total Slots</span>
                    <div className="mt-2 text-3xl font-bold">{totalSlots}</div>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-primary/10 rounded-lg shadow w-64">
                    <span className="text-xl font-semibold">Available Slots</span>
                    <div className="mt-2 text-3xl font-bold">{totalAvailableSlots}</div>
                  </div>
                </div>

                {/* Two-Wheeler Slots */}
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex flex-col items-center p-4 bg-accent/10 rounded-lg shadow w-64">
                    <span className="text-xl font-semibold">2-Wheeler Slots</span>
                    <div className="mt-2 text-3xl font-bold">{totalTwoWheelerSlots}</div>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-accent/10 rounded-lg shadow w-64">
                    <span className="text-xl font-semibold">Available 2-Wheeler Slots</span>
                    <div className="mt-2 text-3xl font-bold">{totalAvailableTwoWheelerSlots}</div>
                  </div>
                </div>

                {/* Four-Wheeler Slots */}
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex flex-col items-center p-4 bg-info/10 rounded-lg shadow w-64">
                    <span className="text-xl font-semibold">4-Wheeler Slots</span>
                    <div className="mt-2 text-3xl font-bold">{totalFourWheelerSlots}</div>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-info/10 rounded-lg shadow w-64">
                    <span className="text-xl font-semibold">Available 4-Wheeler Slots</span>
                    <div className="mt-2 text-3xl font-bold">{totalAvailableFourWheelerSlots}</div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex flex-wrap justify-center gap-6 mt-8">
                  <div className="flex flex-col items-center p-4 bg-success/10 rounded-lg shadow w-64">
                    <span className="text-xl font-semibold">2-Wheeler Price</span>
                    <div className="mt-2 text-3xl font-bold">₹{twoWheelerPrice}</div>
                    <span className="text-lg">per hour</span>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-success/10 rounded-lg shadow w-64">
                    <span className="text-xl font-semibold">4-Wheeler Price</span>
                    <div className="mt-2 text-3xl font-bold">₹{fourWheelerPrice}</div>
                    <span className="text-lg">per hour</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Support Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Support</h2>
            <p>For booking issues, please contact <span className="font-semibold">FindMySlot Support</span>. - 7889607295</p>
            <p>For parking-specific issues, please contact <span className="font-semibold">{parking.organization} Support</span>. - 7889607295</p>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          className="btn btn-primary w-full mt-6"
          onClick={() => {
            if (status === "Book Now") {
              // navigate(`/bookSlot?id=${id}`);
              navigate(`/parkingSlots/?locationId=${id}`);
            } else {
              handleChanges();
            }
          }}

        >
          {status}
        </button>

        {isOwner && (
            <button
              className="btn btn-secondary w-full mt-4"
              onClick={() => navigate(`/owner/add-changes?id=${id}`)}
            >
              Edit Parking Details
            </button>
          )}
      </div>
    </div>
  );
};

export default SelectedParking;
