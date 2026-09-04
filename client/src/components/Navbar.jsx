import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import ChangePasswordModal from './ChangePasswordModal';
import { Shield, Store, Star, LogOut, User, Compass, Award, KeyRound } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          {/* Brand with Bookmark & Star Icon */}
          <Logo />

          {/* Navigation Links */}
          <nav className="header-nav">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <Compass size={16} className="nav-icon" />
              <span>Explore Stores</span>
            </Link>

            <Link
              to="/?sort=rating"
              className={`nav-link ${location.search.includes('sort=rating') ? 'active' : ''}`}
            >
              <Award size={16} className="nav-icon" />
              <span>Top Rated</span>
            </Link>

            {/* Role specific links */}
            {user?.role === 'SYSTEM_ADMIN' && (
              <Link
                to="/admin"
                className={`nav-link role-link admin ${isActive('/admin') ? 'active' : ''}`}
              >
                <Shield size={16} className="nav-icon" />
                <span>Admin Console</span>
              </Link>
            )}

            {user?.role === 'STORE_OWNER' && (
              <Link
                to="/owner"
                className={`nav-link role-link owner ${isActive('/owner') ? 'active' : ''}`}
              >
                <Store size={16} className="nav-icon" />
                <span>Store Dashboard</span>
              </Link>
            )}

            {user?.role === 'NORMAL_USER' && (
              <Link
                to="/my-ratings"
                className={`nav-link role-link user ${isActive('/my-ratings') ? 'active' : ''}`}
              >
                <Star size={16} className="nav-icon" />
                <span>My Ratings</span>
              </Link>
            )}
          </nav>

          {/* User Auth Section */}
          <div className="header-actions">
            {user ? (
              <div className="user-profile-menu">
                <div className="user-badge">
                  <div className="user-avatar-circle">
                    <User size={16} />
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className={`user-role-tag ${user.role.toLowerCase()}`}>
                      {user.role === 'SYSTEM_ADMIN'
                        ? 'Admin'
                        : user.role === 'STORE_OWNER'
                        ? 'Store Owner'
                        : 'Reader / Reviewer'}
                    </span>
                  </div>
                </div>

                {/* Change Password Action */}
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="btn-logout"
                  title="Update Password"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <KeyRound size={15} />
                  <span className="logout-text">Password</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="btn-logout"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                  <span className="logout-text">Exit</span>
                </button>
              </div>
            ) : (
              <div className="guest-actions">
                <Link to="/login" className="btn-signin">
                  Sign In
                </Link>
                <Link to="/register" className="btn-register">
                  Join Community
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
}
