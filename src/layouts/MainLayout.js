import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import { getUIConfig, getAppTitle } from '../services/config';
import './MainLayout.css';

/**
 * Main layout component without settings tab
 */
const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Load UI configuration and check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Get default sidebar state from config
      const uiConfig = getUIConfig();
      const defaultOpen = uiConfig.sidebarDefaultOpen;
      
      // On mobile, sidebar should be closed by default
      // On desktop, use config setting
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(defaultOpen);
      }
    };

    // Initial check
    checkMobile();
    
    // Listen for window resize
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  return (
    <div className="layout">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar}
        onOpen={openSidebar}
      />
      
      <button 
        className={`toggle-sidebar-button ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header with app title */}
        <header className="main-header">
          <h1>{getAppTitle()}</h1>
        </header>
        
        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};

export default MainLayout;