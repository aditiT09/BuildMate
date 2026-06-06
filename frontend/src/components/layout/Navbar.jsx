// src/components/layout/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // AuthContext.jsx

export default function Navbar() {
  const { logout } = useAuth(); // AuthContext.jsx
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // AuthContext.jsx
    navigate("/login"); // axios.js token wipe routing fallback
  };

  return (
    <nav className="bg-white border-b-4 border-[#2B1B12] px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-3xl font-black uppercase tracking-tighter text-[#2B1B12]">
          BUILD<span className="text-[#E35336]">MATE</span>
        </Link>
        <div className="flex gap-6 items-center font-extrabold text-xs uppercase tracking-wider text-[#2B1B12]">
          <Link to="/" className="hover:text-[#E35336] transition-colors">Deck</Link>
          <Link to="/my-projects" className="hover:text-[#E35336] transition-colors">My Projects</Link>
          <Link to="/discover" className="hover:text-[#E35336] transition-colors">Discover</Link>
          <Link to="/applications" className="hover:text-[#E35336] transition-colors">Applications</Link>
          <Link to="/profile" className="hover:text-[#E35336] transition-colors">Profile</Link>
          <button 
            onClick={handleLogout} 
            className="bg-[#EF4444] text-white border-2 border-[#2B1B12] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_#2B1B12] hover:translate-y-0.5 active:shadow-none font-black uppercase tracking-widest text-[10px]"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}