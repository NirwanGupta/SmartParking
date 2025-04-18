// pages/PartnershipPage.jsx

import React, { useState } from 'react';
import { Car, Home, Landmark, Loader2, MapPin, User } from 'lucide-react';
import LocationPicker from '../components/GoogleMapComponent';
import isEmail from 'validator/lib/isEmail';

const PartnershipPage = () => {
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    aadhar: '',
    pan: '',
    floors: 1,
    slotsPerFloor: [''],
    location: {
      lat: '',
      lng: '',
      address: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSelect = ({ lat, lng, address }) => {
    setFormData({
      ...formData,
      location: { lat, lng, address },
    });
    setShowMap(false);
  };

  const handleSlotsChange = (floorIndex, value) => {
    const newSlots = [...formData.slotsPerFloor];
    newSlots[floorIndex] = value;
    setFormData({ ...formData, slotsPerFloor: newSlots });
  };

  const handleFloorChange = (newFloorCount) => {
    const count = parseInt(newFloorCount);
    const slotsArray = Array.from({ length: count }, (_, i) => formData.slotsPerFloor[i] || '');
    setFormData({ ...formData, floors: count, slotsPerFloor: slotsArray });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return alert("Full Name is required");
    if (!formData.email.trim()) return alert("Email is required");
    if (!isEmail(formData.email)) return alert("Invalid email");
    if (!formData.aadhar.trim()) return alert("Aadhar number is required");
    if (!formData.pan.trim()) return alert("PAN number is required");
    if (!formData.location.address) return alert("Location must be selected");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      alert("Submitted successfully!");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-6 sm:p-12'>
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center mb-6">
          <div className="flex flex-col items-center gap-2 group">
            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
              <Car className='size-6 text-primary' />
            </div>
            <h1 className='text-2xl font-bold mt-2'>Partner With Us</h1>
            <p className="text-base-content/60">Provide your parking space to help the community!</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Full Name</span></label>
            <div className="relative">
              <User className="absolute left-3 top-3 size-5 text-base-content/40" />
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Email</span></label>
            <div className="relative">
              <User className="absolute left-3 top-3 size-5 text-base-content/40" />
              <input
                type="email"
                className="input input-bordered w-full pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Aadhar Number</span></label>
            <div className="relative">
              <Landmark className="absolute left-3 top-3 size-5 text-base-content/40" />
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                value={formData.aadhar}
                onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                placeholder="1234 5678 9012"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">PAN Number</span></label>
            <div className="relative">
              <Landmark className="absolute left-3 top-3 size-5 text-base-content/40" />
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                placeholder="ABCDE1234F"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Number of Floors</span></label>
            <input
              type="number"
              min={1}
              className="input input-bordered w-full"
              value={formData.floors}
              onChange={(e) => handleFloorChange(e.target.value)}
            />
          </div>

          {Array.from({ length: formData.floors }, (_, idx) => (
            <div className="form-control" key={idx}>
              <label className="label">
                <span className="label-text font-medium">Slots on Floor {idx + 1}</span>
              </label>
              <input
                type="number"
                min={0}
                className="input input-bordered w-full"
                value={formData.slotsPerFloor[idx]}
                onChange={(e) => handleSlotsChange(idx, e.target.value)}
              />
            </div>
          ))}

          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Location</span></label>
            <button type="button" onClick={() => setShowMap(true)} className="btn btn-outline w-full flex items-center gap-2">
              <MapPin className="size-5" /> Select on Map
            </button>
            {formData.location.address && (
              <p className="text-sm mt-2 text-base-content/70">📍 {formData.location.address}</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-4 w-[90%] max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-sm btn btn-sm btn-error"
              onClick={() => setShowMap(false)}
            >
              Close
            </button>
            <LocationPicker onLocationSelect={handleLocationSelect} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnershipPage;
