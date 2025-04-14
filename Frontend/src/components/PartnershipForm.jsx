import React from 'react';

const PartnershipForm = ({ partnerDetails, onChange, onSubmit }) => {
  return (
    <div className="max-w-xl mx-auto my-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Complete Partnership Details</h1>
        <p className="text-base-content/60">Please provide additional information to complete your registration.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 p-4 rounded-xl shadow-md">
        {/* Brand Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Brand Name</span>
          </label>
          <input
            type="text"
            name="brandName"
            className="input input-bordered w-full"
            value={partnerDetails.brandName}
            onChange={onChange}
            required
          />
        </div>

        {/* Address */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Address</span>
          </label>
          <input
            type="text"
            name="address"
            className="input input-bordered w-full"
            value={partnerDetails.address}
            onChange={onChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Phone Number</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            className="input input-bordered w-full"
            value={partnerDetails.phoneNumber}
            onChange={onChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Complete Partnership
        </button>
      </form>
    </div>
  );
};

export default PartnershipForm;
