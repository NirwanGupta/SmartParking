import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");
      const id = searchParams.get("id");
      const role = searchParams.get("role");

      console.log(token, email);
      console.log("role", role);

      if (!token || !email || !id) {
        toast.error("Invalid verification link!");
        navigate("/");
        return;
      }

      try {
        if (role === "user") {
          const response = await axiosInstance.post(
            `/auth/verifyEmail?token=${token}&email=${email}&id=${id}`
          );
          toast.success(response.data.msg || "Email verified successfully!");
          navigate("/login");
        } else if (role === "owner") {
          const response = await axiosInstance.post(
            `/auth/verifyEmail?token=${token}&email=${email}&id=${id}&role=${role}`
          );
          toast.success(response.data.msg || "Email verified successfully!");
          setIsOwner(true);
          setVerified(true);
        }
      } catch (error) {
        toast.error(error?.response?.data?.msg || "Verification failed!");
        navigate("/");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  if (verified && isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-bold">
          An email with the Partnership Form has been sent to your email ID.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-bold">Verifying your email...</p>
    </div>
  );
};

export default VerifyEmailPage;
