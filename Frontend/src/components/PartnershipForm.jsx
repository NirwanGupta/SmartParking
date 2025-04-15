import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/GoogleMapComponent';

const PartnerRegistrationPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ownerName: '',
    ownerEmail: '',
    password: '',
    brandName: '',
    phoneNumber: '',
    address: '',
    latitude: '',
    longitude: '',
    floors: 1,
    slotsPerFloor: [''],
  });

  const [mapOpen, setMapOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = ({ lat, lng, address }) => {
    setForm({
      ...form,
      latitude: lat,
      longitude: lng,
      address,
    });
    setMapOpen(false);
  };

  const handleFloorsChange = (e) => {
    const floors = parseInt(e.target.value) || 1;
    setForm((prev) => ({
      ...prev,
      floors,
      slotsPerFloor: Array(floors).fill(''),
    }));
  };

  const handleSlotChange = (index, value) => {
    const updatedSlots = [...form.slotsPerFloor];
    updatedSlots[index] = value;
    setForm((prev) => ({
      ...prev,
      slotsPerFloor: updatedSlots,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert('Form submitted successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10 space-y-6">
      <h2 className="text-3xl font-semibold text-center">Partner Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="ownerName"
          placeholder="Owner Name"
          value={form.ownerName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl shadow-sm"
          required
        />
        <input
          type="email"
          name="ownerEmail"
          placeholder="Owner Email"
          value={form.ownerEmail}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl shadow-sm"
          required
        />

        {/* Map Section */}
        <div>
          <label className="block mb-1 font-medium">Business Location</label>
          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            Open Map
          </button>

          {!mapOpen && form.address && (
            <div className="text-xs text-gray-600 mt-2 ml-1 space-y-1">
              <p><strong>Address:</strong> {form.address}</p>
              <p><strong>Latitude:</strong> {form.latitude}</p>
              <p><strong>Longitude:</strong> {form.longitude}</p>
            </div>
          )}
        </div>

        {mapOpen && (
          <div className="mt-4">
            <LocationPicker onLocationSelect={handleLocationSelect} />
          </div>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl shadow-sm"
          required
        />
        <input
          type="text"
          name="brandName"
          placeholder="Brand Name"
          value={form.brandName}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl shadow-sm"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl shadow-sm"
          required
        />

        <div>
          <label className="block mb-1 font-medium">Number of Floors</label>
          <input
            type="number"
            name="floors"
            min="1"
            value={form.floors}
            onChange={handleFloorsChange}
            className="w-full px-4 py-2 border rounded-xl shadow-sm"
            required
          />
        </div>

        {form.slotsPerFloor.map((slot, index) => (
          <div key={index}>
            <label className="block mb-1 text-sm">Slots on Floor {index + 1}</label>
            <input
              type="number"
              min="0"
              value={slot}
              onChange={(e) => handleSlotChange(index, e.target.value)}
              className="w-full px-4 py-2 border rounded-xl shadow-sm"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PartnerRegistrationPage;
