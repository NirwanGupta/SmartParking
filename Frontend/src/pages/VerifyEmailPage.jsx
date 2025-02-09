import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");
      const id = searchParams.get("id");

      console.log(token, email);

      if (!token || !email || !id) {
        toast.error("Invalid verification link!");
        navigate("/");
        return;
      }

      try {
        const response = await axiosInstance.post(`/auth/verifyEmail?token=${token}&email=${email}&id=${id}`);
        toast.success(response.data.msg || "Email verified successfully!");
        navigate("/login");
      } catch (error) {
        toast.error(error?.response?.data?.msg || "Verification failed!");
        navigate("/");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-bold">Verifying your email...</p>
    </div>
  );
};

export default VerifyEmailPage;
