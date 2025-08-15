import React, { useState, useEffect } from 'react';
import StackPlates from '../components/StackPlates';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

const ParkingPage = () => {
  const { getSingleParking } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [floorsData, setFloorsData] = useState([]);

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('locationId');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await getSingleParking(id);
        console.log('Fetched floors:', response.parkingInfo?.floors);
        setFloorsData(response.parkingInfo?.floors || []);
      } catch (error) {
        console.error('Error fetching parking data:', error);
      }
    };
    if (id) {
      fetchSlots();
    }
  }, [id, getSingleParking]);

  const currentFloor = floorsData[selectedFloor];

  const handleSlotClick = (slotIndex, type) => {
    const occupied = currentFloor?.[type]?.occupiedSlotNumbers || [];
    if (occupied.includes(slotIndex + 1)) return;

    setSelectedSlot(slotIndex);
    setSelectedType(type);
    setShowModal(true);
  };

  const handleConfirmBooking = () => {
    const slotNumber = selectedSlot + 1;
    const floorIndex = selectedFloor; // send zero-based index to match backend

    navigate(
      `/bookSlot/?locationId=${id}&slotNumber=${slotNumber}&floorNumber=${floorIndex+1}&vehicleType=${selectedType}`
    );
    setShowModal(false);
  };

  const renderGrid = (type) => {
  const vehicleData = currentFloor?.[type];
  if (!vehicleData) return null;

  const totalSlots = vehicleData.totalSlots || 0;
  const occupiedSlots = vehicleData.occupiedSlotNumbers || [];
  const now = new Date();

  console.log("occupied slots: ", vehicleData.occupiedSlotNumbers );

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-2 text-secondary">
        {type === 'twoWheeler' ? '2-Wheeler Slots' : '4-Wheeler Slots'}
      </h3>
      <div
        className={`
          grid gap-3
          grid-cols-2
          sm:grid-cols-4
          md:grid-cols-6
          lg:grid-cols-8
          xl:grid-cols-10
        `}
      >
        {Array.from({ length: totalSlots }).map((_, i) => {
          const slotNumber = i + 1;
          const booking = occupiedSlots.find(
            (s) => s.slotNumber === slotNumber && new Date(s.endTime) > now
          );
          const isBooked = Boolean(booking);

          return (
            <div
              key={i}
              className={`h-12 flex items-center justify-center text-sm font-semibold rounded-xl 
                ${
                  isBooked
                    ? 'bg-red-500 text-white cursor-not-allowed'
                    : 'bg-base-300 hover:bg-primary hover:text-primary-content cursor-pointer'
                } 
                transition shadow`}
              onClick={() => !isBooked && handleSlotClick(i, type)}
            >
              Slot {slotNumber}
            </div>
          );
        })}
      </div>
    </>
  );
};


  return (
    <>
      <div className="h-screen grid grid-cols-5 bg-base-100 text-base-content">
        <div className="col-span-1 border-r border-base-300 flex flex-col items-center py-10 px-4 bg-base-200">
          <h2 className="text-lg font-bold mb-6 text-primary">Select Floor</h2>
          <StackPlates
            count={floorsData.length}
            onSelect={setSelectedFloor}
            selectedIndex={selectedFloor}
          />
        </div>

        <div className="col-span-4 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {currentFloor?.name || `Floor ${selectedFloor + 1}`}
          </h2>

          {renderGrid('twoWheeler')}
          {renderGrid('fourWheeler')}
        </div>
      </div>

      {showModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Book Slot</h3>
            <p className="py-4">
              Do you want to book <strong>Slot {selectedSlot + 1}</strong> on{' '}
              <strong>
                {currentFloor?.name || `Floor ${selectedFloor + 1}`}
              </strong>{' '}
              for a{' '}
              <strong>
                {selectedType === 'twoWheeler' ? '2-wheeler' : '4-wheeler'}
              </strong>
              ?
            </p>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleConfirmBooking}>
                Yes, Book it
              </button>
              <button className="btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default ParkingPage;
