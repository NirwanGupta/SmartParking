import React, { useState } from 'react';
import { Landmark, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const PartnershipPage = () => {
  const {partnerForm} = useAuthStore();
  const [formData, setFormData] = useState({
    aadhaar: '',
    pan: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!formData.aadhaar.trim()) return alert("Aadhaar number is required");
    if (!formData.pan.trim()) return alert("PAN number is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const result = await partnerForm({
        aadhaar: formData.aadhaar,
        pan: formData.pan
      });

      alert("Submitted successfully!");
      setFormData({ aadhaar: '', pan: '' });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-6 sm:p-12'>
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center mb-6">
          <div className="flex flex-col items-center gap-2 group">
            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
              <Landmark className='size-6 text-primary' />
            </div>
            <h1 className='text-2xl font-bold mt-2'>Partner With Us</h1>
            <p className="text-base-content/60">Provide your parking space to help the community!</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Aadhaar Number</span></label>
            <div className="relative">
              <Landmark className="absolute left-3 top-3 size-5 text-base-content/40" />
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                value={formData.aadhaar}
                onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
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
    </div>
  );
};

export default PartnershipPage;
