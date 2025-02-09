import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Mail, User, MapPin, Phone } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || '',
    email: authUser?.email || '',
    location: authUser?.location || '',
    phone: authUser?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
    <div className="h-screen">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">User Profile</h1>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24">
              <img
                src={authUser.image || "https://res.cloudinary.com/drnrsxnx9/image/upload/v1713185399/Music-World/Profile-Images/default-avatar-profile-icon-vector-social-media-user-image-182145777_mqovgx.webp"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4"
              />
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200">
                <Camera className="w-5 h-5 text-base-200" />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" disabled={isUpdatingProfile} />
              </label>
            </div>
            <p className="text-sm text-zinc-400">Click the camera icon to update your photo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="px-4 py-2.5 bg-base-200 rounded-lg border w-full" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="px-4 py-2.5 bg-base-200 rounded-lg border w-full" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location
              </label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="px-4 py-2.5 bg-base-200 rounded-lg border w-full" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="px-4 py-2.5 bg-base-200 rounded-lg border w-full" />
            </div>

            <button type="submit" className="w-full btn btn-primary text-white py-2 rounded-lg ">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
    <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"No more circling, no more stress—find your perfect parking spot in seconds!"}
      />
    </div>
  );
};

export default ProfilePage;
