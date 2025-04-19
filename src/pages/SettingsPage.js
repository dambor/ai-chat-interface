import React from 'react';
import ApiConfig from '../components/ApiConfig/ApiConfig';
import './SettingsPage.css';

/**
 * Settings page with API configuration only
 */
const SettingsPage = ({ useFallback, toggleFallback }) => {
  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>API Settings</h1>
      </header>
      
      <main className="settings-content">
        <div className="settings-section">
          <ApiConfig />
        </div>
        
        <div className="settings-section">
          <div className="api-response-info">
            <h2>API Response Guide</h2>
            <p>
              This application is designed to handle various API response formats from your backend.
            </p>
            
            <h3>Example Expected API Format</h3>
            <pre>{`// Simple text response:
"This is the AI analysis of Tesla stock..."

// OR JSON with output field:
{
  "output": "This is the AI analysis of Tesla stock..."
}

// OR any other format containing the analysis text`}</pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;