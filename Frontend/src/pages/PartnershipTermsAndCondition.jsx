import React from "react";
import { useNavigate } from "react-router-dom";

const PartnershipTermsAndCondition = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-4">Partner With Us - Terms & Conditions</h1>

      <p className="text-base-content/80 mb-4">
        Thank you for your interest in partnering with our Smart Parking Platform.
        By providing a parking area to be listed on our platform, you agree to the following terms:
      </p>

      <ul className="list-disc list-inside space-y-3 text-base-content/80">
        <li>
          <strong>Ownership:</strong> You must be the legal owner or authorized manager of the parking space you list.
        </li>
        <li>
          <strong>Availability:</strong> You agree to keep the availability status of your parking spots up-to-date.
        </li>
        <li>
          <strong>Safety & Accessibility:</strong> You are responsible for ensuring the safety and accessibility of your parking area.
        </li>
        <li>
          <strong>Pricing:</strong> You may set your own pricing, subject to our platform's dynamic pricing model and approval.
        </li>
        <li>
          <strong>Commission:</strong> We reserve the right to take a commission on every booking made through our platform.
        </li>
        <li>
          <strong>Termination:</strong> Either party may terminate the partnership at any time with prior notice.
        </li>
        <li>
          <strong>Data Usage:</strong> We may use location, availability, and usage data to improve platform performance and user experience.
        </li>
        <li>
          <strong>Legal Compliance:</strong> You are responsible for complying with all applicable local laws and regulations.
        </li>
      </ul>

      <p className="text-base-content/70 mt-6">
        By clicking "Agree & Continue", you acknowledge that you have read and accepted these terms.
      </p>

      <div className="mt-8 flex justify-end gap-4">
        <button
          className="btn btn-outline"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/partner-registration")}
        >
          Agree & Continue
        </button>
      </div>
    </div>
  );
};

export default PartnershipTermsAndCondition;
