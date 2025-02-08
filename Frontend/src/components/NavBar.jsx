import { Search, LogIn, LogOut, UserPlus, Car } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      return toast.error('Enter a location to search!');
    }
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <nav className="navbar bg-base-100 shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 text-xl font-bold">
        <Car className="w-6 h-6 text-primary" />
        FindASpot
      </Link>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="form-control w-full max-w-sm relative">
        <input
          type="text"
          placeholder="Search for a parking spot..."
          className="input input-bordered w-full pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <Search className="h-5 w-5 text-base-content/40" />
        </button>
      </form>

      {/* Auth Links */}
      <div className="flex gap-4 items-center">
        {authUser ? (
          <button onClick={logout} className="btn btn-outline btn-primary flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        ) : (
          <>
            <Link to="/register" className="btn btn-outline flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Signup
            </Link>
            <Link to="/login" className="btn btn-primary flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
