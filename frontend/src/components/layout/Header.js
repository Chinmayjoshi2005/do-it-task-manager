import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'My Tasks',
  '/completed': 'Completed',
  '/leaderboard': 'Global Leaderboard',
  '/profile': 'Profile',
};

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const { mode, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const title = pageTitles[location.pathname] || 'DO IT';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <div className="header__logo" onClick={() => navigate('/dashboard')}>
          <div className="header__logo-mark">
            <img src="/logo.png" alt="DO IT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="header__logo-text">DO IT</span>
        </div>

      </div>

      <div className="header__middle">
        <h1 className="header__title">{title}</h1>
      </div>

      <div className="header__right">
        <div className="header__nav-buttons">
          <button className="header__nav-btn" onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="header__nav-btn" onClick={() => navigate(1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>

        <button
          className="theme-switch"
          data-mode={mode === 'dark' ? 'dark' : 'light'}
          onClick={() => setTheme(mode === 'dark' ? 'light' : 'dark')}
          title="Toggle theme"
        >
          <div className="theme-switch-handle"></div>
          <span className="theme-switch-icon" style={{ opacity: mode === 'dark' ? 1 : 0.4 }}>🌙</span>
          <span className="theme-switch-icon" style={{ opacity: mode === 'dark' ? 0.4 : 1 }}>🌞</span>
        </button>

        {user && (
          <div className="header__user">
            <div className="header__avatar" title={user.username} onClick={() => navigate('/profile')}>
              {user.avatar_base64 ? (
                <img src={user.avatar_base64} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                user.username?.[0]?.toUpperCase()
              )}
            </div>
            <button className="header__logout" onClick={handleLogout} title="Logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
