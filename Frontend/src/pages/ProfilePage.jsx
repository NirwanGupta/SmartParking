import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, MapPin, Phone, Car, Edit, Trash } from "lucide-react"; // Imported Edit and Trash icons
import AuthImagePattern from "../components/AuthImagePattern";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, uploadImage, addVehicle, getVehicles, removeVehicle, editVehicle } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    type: "",
    registrationNumber: "",
    color: "",
    model: "",
  });

  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        email: authUser.email || "",
        location: authUser.location || "",
        phone: authUser.phone || "",
      });
      setSelectedImage(authUser.image);
    }
  }, [authUser]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const fetched = await getVehicles();
      setVehicles(fetched);
    };
    fetchVehicles();
  }, [getVehicles]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await uploadImage(formData);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleVehicleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleAddVehicle = async () => {
    const { type, registrationNumber, color, model } = vehicleData;
    if (!type || !registrationNumber || !color || !model) {
      alert("Please fill all fields.");
      return;
    }

    // Optimistically update UI by adding the new vehicle directly to the list
    const newVehicle = { ...vehicleData, registrationNumber }; // You can structure this as needed
    setVehicles((prev) => [...prev, newVehicle]); // Optimistic update

    try {
      // Add vehicle to backend
      await addVehicle(vehicleData);
      // Fetch updated vehicles list from the backend
      const updatedVehicles = await getVehicles();
      setVehicles(updatedVehicles); // Update the UI with the actual list
      setVehicleData({ type: "", registrationNumber: "", color: "", model: "" });
      setShowVehicleModal(false);
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      alert("Something went wrong while adding vehicle.");
      // If something fails, we may need to remove the vehicle optimistically added above
      setVehicles((prev) => prev.filter((v) => v.registrationNumber !== registrationNumber));
    }
  };

  const handleRemoveVehicle = async (registrationNumber) => {
    try {
      console.log(registrationNumber)
      await removeVehicle(registrationNumber); // Call backend to remove the vehicle
      setVehicles(vehicles.filter((v) => v.registrationNumber !== registrationNumber)); // Update UI optimistically
    } catch (error) {
      console.error("Failed to remove vehicle:", error);
      alert("Something went wrong while removing the vehicle.");
    }
  };

  const handleEditVehicle = async (vehicle) => {
    // Assuming editVehicle function shows the modal and pre-fills the data for editing
    setVehicleData(vehicle);
    setShowVehicleModal(true);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-2xl w-full p-4">
          <div className="bg-base-300 rounded-xl p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">User Profile</h1>
            </div>

            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-24 h-24">
                <img
                  src={authUser.image}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    disabled={isUpdatingProfile}
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">Click the camera icon to update your photo</p>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  disabled={isUpdatingProfile}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-zinc-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  disabled={isUpdatingProfile}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-zinc-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  disabled={isUpdatingProfile}
                />
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary text-white py-2 rounded-lg"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>

            {/* Add Vehicle */}
            <div className="pt-4 border-t mt-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Your Vehicles</h2>
                <button onClick={() => setShowVehicleModal(true)} className="btn btn-sm btn-outline">
                  + Add Vehicle
                </button>
              </div>

              {vehicles.length === 0 ? (
                <p className="text-sm text-zinc-400">No vehicles added yet.</p>
              ) : (
                <ul className="space-y-2">
                  {vehicles
                    .filter((vehicle) => vehicle?.registrationNumber) // Ensure registrationNumber exists
                    .map((v, index) => (
                      <li key={index} className="bg-base-200 p-3 rounded-lg text-sm flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{v.registrationNumber} ({v.type})</div>
                          <div className="text-zinc-500">{v.color} - {v.model}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditVehicle(v)} className="text-blue-500 hover:text-blue-700">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleRemoveVehicle(v.registrationNumber)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"No more circling, no more stress—find your perfect parking spot in seconds!"}
      />

      {/* Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-base-100 rounded-xl p-6 w-[90%] max-w-md shadow-lg space-y-4">
            <h3 className="text-lg font-semibold mb-2">Add Vehicle</h3>

            <div>
              <label className="block text-sm mb-1">Vehicle Type</label>
              <select
                name="type"
                value={vehicleData.type}
                onChange={handleVehicleChange}
                className="input input-bordered w-full"
              >
                <option value="">Select Type</option>
                <option value="Car">Car</option>
                <option value="Truck">Truck</option>
                <option value="Motorcycle">Motorcycle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={vehicleData.registrationNumber}
                onChange={handleVehicleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={vehicleData.color}
                onChange={handleVehicleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Model</label>
              <input
                type="text"
                name="model"
                value={vehicleData.model}
                onChange={handleVehicleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setShowVehicleModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary ml-2"
                onClick={handleAddVehicle}
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
