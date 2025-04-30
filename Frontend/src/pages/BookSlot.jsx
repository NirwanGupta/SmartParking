import {
  Building,
  Hash,
  LayoutGrid,
  Car,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthImagePattern from '../components/AuthImagePattern';
import { useAuthStore } from '../store/useAuthStore';
import { useParkingStore } from '../store/useParkingStore';

//  locationId -> selectedBuildingId, floor: floor, vehicleType: 2 Wheeler, 4 wheeler, slotNumber: slotNumber, 


const BookSlot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const slotNumber = query.get('slotNumber') || '';
  const floorNumber = query.get('floorNumber') || '';
  const selectedBuildingId = query.get('locationId') || '';
  const vehicleType = query.get('vehicleType') || '';

  // const { selectedBuildingId } = useAuthStore();
  const { bookParkingSlot } = useParkingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    selectedBuilding_id: '',
    floor: floorNumber,
    slot: slotNumber,
    registrationNumber: '',
    duration: '',
    paymentStatus: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (data) => {
    const {
      selectedBuilding_id,
      floor,
      slot,
      registrationNumber,
      duration,
      paymentStatus,
    } = data;

    console.log("data: ", data);

    console.log(selectedBuildingId)

    if (!selectedBuilding_id.trim())
      return toast.error('Building ID is required');
    if (!floor.trim()) return toast.error('Floor is required');
    if (!slot.trim()) return toast.error('Slot is required');
    if (!registrationNumber.trim())
      return toast.error('Vehicle Registration Number is required');
    if (!duration.trim()) return toast.error('Duration is required');
    if (!paymentStatus) return toast.error('Payment status is required');

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      selectedBuilding_id: selectedBuildingId,
    };

    setFormData(updatedFormData);

    // if (!validateForm(updatedFormData)) return;

    setIsSubmitting(true);

    try {
      const success = validateForm(updatedFormData);
      if(success) {
        const success = await bookParkingSlot(updatedFormData);

      }
      toast.success('Slot booked successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Book Your Slot</h1>
              <p className="text-base-content/60">
                Fill in the details to reserve your spot
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Floor */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Floor</span>
              </label>
              <div className="relative">
                <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 h-5 w-5" />
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="e.g., 2"
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            {/* Slot */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Slot</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 h-5 w-5" />
                <input
                  type="text"
                  name="slot"
                  value={formData.slot}
                  onChange={handleChange}
                  placeholder="e.g., A12"
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            {/* Registration Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Registration Number</span>
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 h-5 w-5" />
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  placeholder="e.g., MH12AB1234"
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Duration (hrs)</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 h-5 w-5" />
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 2"
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            {/* Payment Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Payment Status</span>
              </label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 h-5 w-5" />
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="select select-bordered w-full pl-10"
                >
                  <option value="">Select status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Booking...
                </>
              ) : (
                'Book Slot'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right - Pattern/Image */}
      <AuthImagePattern
        title={'Reserve your spot now!'}
        subtitle={'Secure hassle-free parking with just a few clicks!'}
      />
    </div>
  );
};

export default BookSlot;
