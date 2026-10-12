import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { APP_NAME } from "../config/constants";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="brand-text">{APP_NAME}</span>
      </div>
      <div className="navbar-right">
        <span className="user-chip">{user?.username} · {user?.role}</span>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}