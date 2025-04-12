import React, { useState } from 'react';
import StackPlates from '../components/StackPlates';
import { useNavigate } from 'react-router-dom';

const TOTAL_FLOORS = 5;
const ROWS = 10;
const COLUMNS = 10;


const ParkingPage = () => {
    const navigate = useNavigate();
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSlotClick = (slotIndex) => {
    setSelectedSlot(slotIndex);
    setShowModal(true);
  };

    const handleConfirmBooking = () => {
        const slotNumber = selectedSlot + 1;
        const floorNumber = selectedFloor+1;

        navigate(`/bookSlot/?slotNumber=${slotNumber}&floorNumber=${floorNumber}`);
        setShowModal(false);
    };


  return (
    <>
      <div className="h-screen grid grid-cols-5 bg-base-100 text-base-content">
        {/* Left: Floor Selector */}
        <div className="col-span-1 border-r border-base-300 flex flex-col items-center py-10 px-4 bg-base-200">
          <h2 className="text-lg font-bold mb-6 text-primary">Select Floor</h2>
          <StackPlates
            count={TOTAL_FLOORS}
            onSelect={setSelectedFloor}
            selectedIndex={selectedFloor}
          />
        </div>

        {/* Right: Parking Grid */}
        <div className="col-span-4 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Floor {selectedFloor+1}
          </h2>

          <div className="grid grid-cols-10 gap-3">
            {Array.from({ length: ROWS * COLUMNS }).map((_, i) => (
              <div
                key={i}
                className="h-12 flex items-center justify-center text-sm font-semibold rounded-xl 
                           bg-base-300 text-base-content 
                           hover:bg-primary hover:text-primary-content 
                           transition cursor-pointer shadow"
                onClick={() => handleSlotClick(i)}
              >
                Slot {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Book Slot</h3>
            <p className="py-4">
              Do you want to book <strong>Slot {selectedSlot + 1}</strong> on{' '}
              <strong>Floor {selectedFloor+1}</strong>?
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
