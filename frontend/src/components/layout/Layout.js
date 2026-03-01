import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;

    const handleScroll = () => {
      setSidebarOpen(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout">
      <Header onMenuClick={toggleSidebar} />
      <div className="layout__body">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`layout__content ${sidebarOpen ? 'layout__content--shifted' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, paddingBottom: 40 }}>
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
      <div
        className={`layout__overlay ${sidebarOpen ? 'layout__overlay--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  );
}
