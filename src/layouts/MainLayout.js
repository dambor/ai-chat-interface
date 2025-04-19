import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import './MainLayout.css';

/**
 * Main layout component with sidebar and content area
 */
const MainLayout = ({ children, currentRoute, navigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} />
      
      <button 
        className="toggle-sidebar-button"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        {isSidebarOpen ? '←' : '→'}
      </button>
      
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Navigation Bar */}
        <nav className="main-nav">
          <button 
            className={`nav-button ${currentRoute === 'chat' ? 'active' : ''}`}
            onClick={() => navigate('chat')}
          >
            Chat
          </button>
          <button 
            className={`nav-button ${currentRoute === 'settings' ? 'active' : ''}`}
            onClick={() => navigate('settings')}
          >
            Settings
          </button>
        </nav>
        
        {/* Main Content */}
        {children}
      </div>
    </div>
  );
};

export default MainLayout;