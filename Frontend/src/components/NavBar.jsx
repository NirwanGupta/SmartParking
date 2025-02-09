import { Search, LogIn, LogOut, UserPlus, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      return toast.error("Enter a location to search!");
    }
    // Handle search logic
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-6 py-3">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          FindMySpot
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {authUser ? (
              <>
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/register">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Signup
                  </Link>
                </li>
                <li>
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
