import React from 'react';
import ApiConfig from '../components/ApiConfig/ApiConfig';
import './SettingsPage.css';

/**
 * Settings page with API configuration and fallback options
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
          <div className="fallback-control">
            <h2>Troubleshooting Options</h2>
            
            <div className="toggle-container">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={useFallback}
                  onChange={toggleFallback}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">
                Use Fallback Tesla Analysis
              </span>
            </div>
            
            <p className="fallback-description">
              When enabled, queries about Tesla stock will return a properly formatted analysis 
              instead of using the API. This is useful if your API is returning template data 
              instead of proper analysis.
            </p>
          </div>
        </div>
        
        <div className="settings-section">
          <div className="api-response-info">
            <h2>API Response Guide</h2>
            <p>
              This application is designed to handle various API response formats from your backend.
              If you're still seeing empty responses or templates, try enabling the fallback mode above.
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