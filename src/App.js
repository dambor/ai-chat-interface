import React, { useState, useEffect } from 'react';
import { ConversationProvider } from './contexts/ConversationContext';
import MainLayout from './layouts/MainLayout';
import EnhancedChat from './pages/EnhancedChat';
import { loadConfig, getAppTitle } from './services/config';

function App() {
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [configError, setConfigError] = useState(null);
  const [appTitle, setAppTitle] = useState('AI Chat Interface');

  // Load configuration on app startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing application...');
        const config = await loadConfig();
        setAppTitle(getAppTitle());
        setIsConfigLoaded(true);
        console.log('Application initialized successfully');
      } catch (error) {
        console.error('Failed to initialize application:', error);
        setConfigError(error.message);
        setIsConfigLoaded(true); // Still allow app to load with defaults
      }
    };

    initializeApp();
  }, []);

  // Update document title
  useEffect(() => {
    document.title = appTitle;
  }, [appTitle]);

  // Show loading screen while configuration is loading
  if (!isConfigLoaded) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #10a37f',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading configuration...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show error message if configuration failed to load
  if (configError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb',
        fontFamily: 'Inter, sans-serif',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#b91c1c', margin: '0 0 12px 0' }}>Configuration Error</h2>
          <p style={{ color: '#7f1d1d', margin: '0 0 16px 0' }}>
            Failed to load application configuration: {configError}
          </p>
          <p style={{ color: '#7f1d1d', fontSize: '14px', margin: '0' }}>
            The application will continue with default settings.
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#10a37f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ConversationProvider>
      <MainLayout>
        <EnhancedChat />
      </MainLayout>
    </ConversationProvider>
  );
}

export default App;