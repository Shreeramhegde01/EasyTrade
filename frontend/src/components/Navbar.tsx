import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout, getCurrentUser } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Easy Trade</Link>

      <form className="navbar-search" onSubmit={handleSearch}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search for items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="navbar-search-input"
        />
      </form>

      <div className="navbar-actions">
        {loggedIn ? (
          <>
            <Link to="/post" className="btn btn-primary btn-sm" id="post-item-btn">
              + Sell
            </Link>
            <Link to="/chat" className="navbar-link" id="chat-link">💬 Chat</Link>
            <Link to="/my-listings" className="navbar-link" id="my-listings-link">📋 My Ads</Link>
            <Link to="/profile" className="navbar-link" id="profile-link">
              👤 {user?.name?.split(' ')[0]}
            </Link>
            <button onClick={handleLogout} className="navbar-link" id="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link" id="login-link">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm" id="signup-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
