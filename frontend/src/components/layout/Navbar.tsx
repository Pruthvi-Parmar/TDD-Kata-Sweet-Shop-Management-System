import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🍬 Sweet Shop</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/">Home</Link>
        
        {isAdmin && (
          <Link to="/admin">Admin Panel</Link>
        )}
        
        {isAuthenticated ? (
          <div className="navbar-user">
            <span className="user-name">Hi, {user?.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="btn-link">Login</Link>
            <Link to="/register" className="btn-primary-small">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

