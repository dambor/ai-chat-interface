import React, { useState } from 'react';
import './ApiTestTool.css';

/**
 * API testing tool for developers
 */
const ApiTestTool = () => {
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:7860/api/v1/run/6f17d4f7-284b-40e3-9b81-213baf319f2c');
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    "input_value": "Hello, this is a test message",
    "output_type": "chat",
    "input_type": "chat",
    "session_id": "test_session"
  }, null, 2));
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const testApi = async () => {
    setIsLoading(true);
    setError('');
    setResponse('');
    
    try {
      // Parse the request body
      const parsedBody = JSON.parse(requestBody);
      
      // Make the API call
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedBody)
      };
      
      const fetchResponse = await fetch(apiUrl, options);
      
      // Get response status and headers
      const status = fetchResponse.status;
      const headers = {};
      fetchResponse.headers.forEach((value, name) => {
        headers[name] = value;
      });
      
      // Get response body
      const responseData = await fetchResponse.json();
      
      // Format the complete response
      const formattedResponse = {
        status,
        headers,
        body: responseData
      };
      
      setResponse(JSON.stringify(formattedResponse, null, 2));
    } catch (err) {
      console.error('API test error:', err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="api-test-tool">
      <h2>API Test Tool</h2>
      
      <div className="api-form">
        <div className="form-group">
          <label htmlFor="apiUrl">API URL</label>
          <input
            id="apiUrl"
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="Enter API URL"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="requestBody">Request Body (JSON)</label>
          <textarea
            id="requestBody"
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            placeholder="Enter JSON request body"
            rows={10}
          />
        </div>
        
        <button 
          className="test-button"
          onClick={testApi}
          disabled={isLoading}
        >
          {isLoading ? 'Testing...' : 'Test API'}
        </button>
      </div>
      
      {error && (
        <div className="api-error">
          <h3>Error</h3>
          <pre>{error}</pre>
        </div>
      )}
      
      {response && (
        <div className="api-response">
          <h3>Response</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTestTool;