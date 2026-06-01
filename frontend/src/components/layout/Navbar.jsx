import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <Link
          to="/dashboard"
          className="text-xl font-bold"
        >
          BuildMate
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/dashboard">Dashboard</Link>

          <Link to="/discover">
            Discover
          </Link>

          <Link to="/applications">
            My Applications
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}