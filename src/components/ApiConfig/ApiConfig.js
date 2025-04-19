import React, { useState, useEffect } from 'react';
import { getApiEndpoint, updateApiEndpoint } from '../../services/api';
import './ApiConfig.css';

/**
 * Component for configuring API settings
 */
const ApiConfig = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [saved, setSaved] = useState(false);
  
  // Load current API endpoint on mount
  useEffect(() => {
    setApiUrl(getApiEndpoint());
  }, []);
  
  const handleSave = () => {
    if (updateApiEndpoint(apiUrl)) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };
  
  return (
    <div className="api-config">
      <h2>API Configuration</h2>
      
      <div className="config-form">
        <div className="form-group">
          <label htmlFor="apiEndpoint">API Endpoint</label>
          <input
            id="apiEndpoint"
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="Enter API endpoint URL"
          />
        </div>
        
        <button 
          className="save-button"
          onClick={handleSave}
        >
          Save Configuration
        </button>
        
        {saved && (
          <div className="save-notification">
            Configuration saved successfully!
          </div>
        )}
      </div>
      
      <div className="api-help">
        <h3>Debug Information</h3>
        <p>
          If you're seeing empty responses, check your browser console for detailed debugging information.
          The chat interface has been enhanced to handle various API response formats automatically.
        </p>
      </div>
    </div>
  );
};

export default ApiConfig;