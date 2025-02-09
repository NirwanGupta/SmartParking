import { Search, LogIn, LogOut, UserPlus, Car } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      return toast.error("Enter a location to search!");
    }
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <nav className="navbar bg-base-100 shadow-md px-4 md:px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-lg md:text-xl font-bold">
        <Car className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        FindMySpot
      </Link>

      {/* Search Bar - Hidden on Small Screens */}
      <div className="hidden md:flex w-full max-w-sm">
        <form onSubmit={handleSearch} className="form-control w-full relative">
          <input
            type="text"
            placeholder="Search for a parking spot..."
            className="input input-bordered w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          >
            <Search className="h-4 w-4 md:h-5 md:w-5 text-base-content/40" />
          </button>
        </form>
      </div>

      {/* Auth Links */}
      <div className="flex gap-3 md:gap-4 items-center">
        {authUser ? (
          <button
            onClick={logout}
            className="btn btn-outline btn-primary flex items-center gap-2 text-sm md:text-base"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" onClick={logout}/>
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/register"
              className="btn btn-outline flex items-center gap-2 text-sm md:text-base"
            >
              <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
              Signup
            </Link>
            <Link
              to="/login"
              className="btn btn-primary flex items-center gap-2 text-sm md:text-base"
            >
              <LogIn className="w-4 h-4 md:w-5 md:h-5" />
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
