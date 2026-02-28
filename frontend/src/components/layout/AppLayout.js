import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'All Tasks',
  '/tasks/today': "Today's Tasks",
  '/tasks/upcoming': 'Upcoming',
  '/tasks/completed': 'Completed',
  '/profile': 'Profile',
};

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'TaskFlow';

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-content">
        <Topbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <div className="page-container page-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
