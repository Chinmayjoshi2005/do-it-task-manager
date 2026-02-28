import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    )
  },
  {
    to: '/leaderboard',
    label: 'Leaderboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
      </svg>
    )
  },
  {
    to: '/tasks',
    label: 'My Tasks',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    )
  },
  {
    to: '/completed',
    label: 'Completed',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
      </svg>
    )
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  return (
    <aside className={"sidebar " + (isOpen ? "sidebar--open" : "")}>
      <nav className="sidebar__nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => "sidebar__link " + (isActive ? "sidebar__link--active" : "")}
            onClick={() => onClose()}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {user && (
        <div className="sidebar__footer">
          <Link to="/profile" className="sidebar__profile-link" onClick={() => onClose()}>
            <div className="sidebar__profile-avatar">
              {user.avatar_base64 ? (
                <img src={user.avatar_base64} alt="Avatar" />
              ) : (
                user.username?.[0]?.toUpperCase()
              )}
            </div>
            <div className="sidebar__profile-info">
              <span className="sidebar__profile-name">{user.username}</span>
            </div>
            <div className="sidebar__profile-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
