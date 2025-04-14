import React, { useState } from 'react';
import RegisterBeforePartner from '../components/RegisterBeforePartner';
import PartnershipForm from '../components/PartnershipForm';
import { useNavigate } from 'react-router-dom';

const PartnerRegistrationPage = () => {
  const [registrationData, setRegistrationData] = useState({
    ownerName: '',
    ownerEmail: '',
    password: '',
  });
  const [partnerDetails, setPartnerDetails] = useState({
    brandName: '',
    address: '',
    phoneNumber: '',
  });
  const [isRegistered, setIsRegistered] = useState(false);
  // const [isEmailSent, setIsEmailSent] = useState(false);
  // const [isEmailVerified, setIsEmailVerified] = useState(false);

  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePartnerChange = (e) => {
    setPartnerDetails({
      ...partnerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    setIsRegistered(true);
    // setIsEmailSent(true);
  };

  // const handleVerifyEmail = () => {
  //   setIsEmailVerified(true);
  // };

  const handlePartnerSubmit = (e) => {
    e.preventDefault();
    alert("Partnership form submitted successfully!");
    navigate('/dashboard'); // Assuming a dashboard after partnership completion
  };

  return (
    <div className="max-w-xl mx-auto my-10">
      {isRegistered && (
        <RegisterBeforePartner
          registrationData={registrationData}
          onChange={handleRegisterChange}
          onSubmit={handleRegisterSubmit}
          isEmailSent={isEmailSent}
          isEmailVerified={isEmailVerified}
        />
      )}

      {(
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Step 2: Complete Partnership Details</h2>
          <PartnershipForm
            partnerDetails={partnerDetails}
            onChange={handlePartnerChange}
            onSubmit={handlePartnerSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default PartnerRegistrationPage;
