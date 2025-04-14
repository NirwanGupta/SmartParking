import React, { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const RegisterBeforePartner = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    password: '',
  });

  const { registerPartner, isRegistering } = useAuthStore(); // You need to define this action

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.ownerName.trim()) return toast.error("Owner's Name is required");
    if (!formData.ownerEmail.trim()) return toast.error("Email is required");
    if (!isEmail(formData.ownerEmail)) return toast.error("Invalid Email");
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      fullName: formData.ownerName,
      email: formData.ownerEmail,
      password: formData.password,
      role: 'owner',
    };

    const success = await registerPartner(payload);
    if (success) {
      navigate('/send-email');
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Register with Us</h1>
        <p className="text-base-content/60">
          Sign up to start your partnership journey.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-4 rounded-xl shadow-md">
        {/* Owner Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Owner's Name</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-base-content/40" />
            </div>
            <input
              type="text"
              name="ownerName"
              className="input input-bordered w-full pl-10"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Owner Email */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Owner's Email</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-base-content/40" />
            </div>
            <input
              type="email"
              name="ownerEmail"
              className="input input-bordered w-full pl-10"
              value={formData.ownerEmail}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Password</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-base-content/40" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="input input-bordered w-full pl-10"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="size-5 text-base-content/40" />
              ) : (
                <Eye className="size-5 text-base-content/40" />
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isRegistering}>
          {isRegistering ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Registering...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterBeforePartner;
