import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useOwnerStore } from '../store/useOwnerStore';

const OwnerAddChanges = () => {
    const { ownerAddFloor, getSingleParking } = useOwnerStore();
  const { state } = useLocation();
  const { parking } = state || {};

  const [buildingName, setBuildingName] = useState(parking?.buildingName || '');
  const [organization, setOrganization] = useState(parking?.organization || '');
  const [address, setAddress] = useState(parking?.address || '');
  const [latitude, setLatitude] = useState(parking?.coordinates.latitude || '');
  const [longitude, setLongitude] = useState(parking?.coordinates.longitude || '');
  const [floors, setFloors] = useState(parking?.parkingInfo.floors || []);

  // Modal related states
  const [showModal, setShowModal] = useState(false);
  const [newFloorData, setNewFloorData] = useState({
    name: '',
    twoWheelerSlots: 0,
    twoWheelerPrice: 0,
    fourWheelerSlots: 0,
    fourWheelerPrice: 0
  });

  const handleFloorChange = (index, field, value) => {
    const updatedFloors = [...floors];
    if (field === 'twoWheelerSlots') {
      updatedFloors[index].twoWheeler.totalSlots = parseInt(value) || 0;
    } else if (field === 'fourWheelerSlots') {
      updatedFloors[index].fourWheeler.totalSlots = parseInt(value) || 0;
    } else if (field === 'twoWheelerPrice') {
      updatedFloors[index].twoWheeler.ratePerHour = parseInt(value) || 0;
    } else if (field === 'fourWheelerPrice') {
      updatedFloors[index].fourWheeler.ratePerHour = parseInt(value) || 0;
    }
    setFloors(updatedFloors);
  };

  const openAddFloorModal = () => {
    setNewFloorData({
      name: '',
      twoWheelerSlots: 0,
      twoWheelerPrice: 0,
      fourWheelerSlots: 0,
      fourWheelerPrice: 0
    });
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    const object = {
        name: newFloorData.name,
        twoWheeler: {
            occupiedSlotNumbers: [],
            occupiedSlots: 0,
            ratePerHour: parseInt(newFloorData.twoWheelerPrice) || 0,
            totalSlots: parseInt(newFloorData.twoWheelerSlots) || 0
        },
        fourWheeler: {
            occupiedSlotNumbers: [],
            occupiedSlots: 0,
            ratePerHour: parseInt(newFloorData.fourWheelerPrice) || 0,
            totalSlots: parseInt(newFloorData.fourWheelerSlots) || 0
        }
    }
    await ownerAddFloor({...object, locationId: parking._id});
    const updated = await getSingleParking(parking._id);
    setFloors(updated.parkingInfo.floors || []);
    const newFloor = {
      name: newFloorData.name,
      twoWheeler: { totalSlots: parseInt(newFloorData.twoWheelerSlots) || 0, occupiedSlots: 0, ratePerHour: parseInt(newFloorData.twoWheelerPrice) || 0 },
      fourWheeler: { totalSlots: parseInt(newFloorData.fourWheelerSlots) || 0, occupiedSlots: 0, ratePerHour: parseInt(newFloorData.fourWheelerPrice) || 0 }
    };
    setFloors([...floors, newFloor]);
    setShowModal(false);
  };

  const removeFloor = (index) => {
    const updatedFloors = floors.filter((_, i) => i !== index);
    setFloors(updatedFloors);
  };

  const handleSubmit = () => {
    const updatedParking = {
      buildingName,
      organization,
      address,
      coordinates: { latitude, longitude },
      parkingInfo: { floors }
    };
    console.log('Updated Parking Info:', updatedParking);
    // TODO: API call to update parking info
  };

  if (!parking) {
    return <div className="min-h-screen flex items-center justify-center">No Parking Data Found</div>;
  }

  console.log(floors);
  return (
    <div className="min-h-screen p-6 sm:p-12">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Edit Parking Details</h1>
          <p className="text-base-content/60 mt-2">{parking.organization} - Modify your building info</p>
        </div>

        {/* Building Info */}
        <div className="card bg-base-100 shadow p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Building Information</h2>

          {/* Input Fields */}
          <div className="form-control">
            <label className="label">Building Name</label>
            <input type="text" className="input input-bordered" value={buildingName} onChange={(e) => setBuildingName(e.target.value)} />
          </div>

          <div className="form-control">
            <label className="label">Organization</label>
            <input type="text" className="input input-bordered" value={organization} onChange={(e) => setOrganization(e.target.value)} />
          </div>

          <div className="form-control">
            <label className="label">Address</label>
            <input type="text" className="input input-bordered" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
                <label className="label">Latitude</label>
                <input
                type="number"
                className="input input-bordered"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                />
            </div>

            <div className="form-control w-full">
                <label className="label">Longitude</label>
                <input
                type="number"
                className="input input-bordered"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                />
            </div>
        </div>

        </div>

        {/* Floor Info */}
        <div className="card bg-base-100 shadow p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Floors</h2>
            <button className="btn btn-accent" onClick={openAddFloorModal}>Add Floor</button>
          </div>

          {floors.map((floor, index) => (
            <div key={index} className="p-4 border rounded-md space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{floor.name || `Floor ${index + 1}`}</h3>
                <button className="btn btn-error btn-sm" onClick={() => removeFloor(index)}>Remove</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Floor slot inputs */}
                <div className="form-control">
                  <label className="label">2-Wheeler Slots</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={floor.twoWheeler.totalSlots}
                    onChange={(e) => handleFloorChange(index, 'twoWheelerSlots', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">2-Wheeler Rate per Hour</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={floor.twoWheeler.ratePerHour}
                    onChange={(e) => handleFloorChange(index, 'twoWheelerPrice', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">4-Wheeler Slots</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={floor.fourWheeler.totalSlots}
                    onChange={(e) => handleFloorChange(index, 'fourWheelerSlots', e.target.value)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">4-Wheeler Rate per Hour</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={floor.fourWheeler.ratePerHour}
                    onChange={(e) => handleFloorChange(index, 'fourWheelerPrice', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save Changes */}
        <button className="btn btn-primary w-full mt-6" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-2xl font-semibold">Add New Floor</h2>

            <div className="form-control">
              <label className="label">Floor Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={newFloorData.name}
                onChange={(e) => setNewFloorData({ ...newFloorData, name: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">2-Wheeler Slots</label>
              <input
                type="number"
                className="input input-bordered"
                value={newFloorData.twoWheelerSlots}
                onChange={(e) => setNewFloorData({ ...newFloorData, twoWheelerSlots: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">2-Wheeler Rate per Hour</label>
              <input
                type="number"
                className="input input-bordered"
                value={newFloorData.twoWheelerPrice}
                onChange={(e) => setNewFloorData({ ...newFloorData, twoWheelerPrice: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">4-Wheeler Slots</label>
              <input
                type="number"
                className="input input-bordered"
                value={newFloorData.fourWheelerSlots}
                onChange={(e) => setNewFloorData({ ...newFloorData, fourWheelerSlots: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">4-Wheeler Rate per Hour</label>
              <input
                type="number"
                className="input input-bordered"
                value={newFloorData.fourWheelerPrice}
                onChange={(e) => setNewFloorData({ ...newFloorData, fourWheelerPrice: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleModalSubmit}>Add Floor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerAddChanges;
