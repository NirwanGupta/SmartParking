import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, Building2 } from 'lucide-react';
import { useOwnerStore } from '../store/useOwnerStore';
import toast from 'react-hot-toast';
import GoogleMapReact from 'google-map-react';

const Marker = () => (
  <div className="text-primary">
    <MapPin size={28} />
  </div>
);

const CreateParkingPage = () => {
  const { createParking, isCreatingParking } = useOwnerStore();

  const [formData, setFormData] = useState({
    organization: '',
    buildingName: '',
    address: '',
    latitude: 28.6139,
    longitude: 77.2090,
  });

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
  }, []);

  // Handle clicking on the map: update lat, lng, and address
  const handleMapClick = async ({ lat, lng }) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      const address = data.results?.[0]?.formatted_address || '';

      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        address,
      }));
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      toast.error('Failed to fetch address');
    }
  };

  // Handle manual address input and convert to lat/lng
  const handleAddressChange = async (e) => {
    const address = e.target.value;
    setFormData((prev) => ({ ...prev, address }));

    if (!address) return;

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.organization ||
      !formData.buildingName ||
      !formData.address
    ) {
      return toast.error('All fields are required');
    }
    await createParking(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Parking</h1>
              <p className="text-base-content/60">
                Fill in the details to create a new parking location
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Organization</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Organization Name"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Building Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Building Name"
                value={formData.buildingName}
                onChange={(e) =>
                  setFormData({ ...formData, buildingName: e.target.value })
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Address</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Full Address"
                value={formData.address}
                onChange={handleAddressChange}
              ></textarea>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Latitude</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.latitude ?? ''}
                disabled
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Longitude</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.longitude ?? ''}
                disabled
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isCreatingParking}
            >
              {isCreatingParking ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Creating...
                </>
              ) : (
                'Create Parking'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Map */}
      <div className="relative h-full w-full">
        <GoogleMapReact
          bootstrapURLKeys={{
            key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          }}
          center={{
            lat: formData.latitude || 28.6139,
            lng: formData.longitude || 77.2090,
          }}
          defaultZoom={14}
          onClick={handleMapClick}
        >
          <Marker lat={formData.latitude} lng={formData.longitude} />
        </GoogleMapReact>
        <div className="absolute top-2 left-2 bg-base-100 p-2 rounded shadow text-sm">
          <p>
            <span className="font-semibold">Latitude:</span>{' '}
            {formData.latitude ? formData.latitude.toFixed(5) : '...'}
          </p>
          <p>
            <span className="font-semibold">Longitude:</span>{' '}
            {formData.longitude ? formData.longitude.toFixed(5) : '...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateParkingPage;
