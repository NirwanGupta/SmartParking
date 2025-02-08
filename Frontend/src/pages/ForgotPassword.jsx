import { Mail } from "lucide-react";
import { useState } from "react";
import AuthImagePattern from "../components/AuthImagePattern";
import isEmail from "validator/lib/isEmail";
import { useAuthStore } from "../store/useAuthStore";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const {forgotPassword} = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email is required");
    if (!isEmail(email)) return toast.error("Invalid Email");
    await forgotPassword({email});
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-base-200">
      {/* Left Section - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 ">
          <h2 className="text-2xl font-bold text-center text-primary">
            Forgot Password
          </h2>
          <p className="text-center text-secondary">
            Enter your email to reset your password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 py-2"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full py-2 rounded-lg"
              onSubmit={handleSubmit}
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>

      {/* Right Section - Image */}
      <AuthImagePattern
        title={"Forgot your password?"}
        subtitle={
          "Enter your email and we'll send you a reset link to regain access."
        }
      />
    </div>
  );
};

export default ForgotPassword;
