import { Car, MapPin, Clock, CreditCard, ParkingCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';

const HomePage = () => {
  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Content */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mt-2">Smart Parking System</h1>
              <p className="text-base-content/60 text-center">
                No more circling, no more stress—find your perfect parking spot in seconds!
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <ParkingCircle className="h-8 w-8 text-primary" />
              <span className="text-lg font-medium">Real-time Parking Spot Availability</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="h-8 w-8 text-primary" />
              <span className="text-lg font-medium">Find & Reserve Nearby Parking</span>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-primary" />
              <span className="text-lg font-medium">Save Time with Pre-booking</span>
            </div>
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-primary" />
              <span className="text-lg font-medium">Seamless Digital Payments</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 mt-6">
            <Link to="/login" className="btn btn-primary w-full">Sign In</Link>
            <Link to="/register" className="btn btn-outline w-full">Create an Account</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern 
        title={"Smart Parking, Simplified"} 
        subtitle={"Book your parking space before you arrive and save time effortlessly."} 
      />
    </div>
  );
};

export default HomePage;
