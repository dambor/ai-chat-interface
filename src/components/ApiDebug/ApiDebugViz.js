import React, { useState, useEffect } from 'react';
import './ApiDebugViz.css';

/**
 * Component for debugging API responses
 */
const ApiDebugViz = () => {
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Intercept console.log and store API-related logs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    console.log = (...args) => {
      // Call original console.log
      originalConsoleLog(...args);
      
      // Only store API-related logs
      const logMessage = args.map(arg => String(arg)).join(' ');
      if (
        logMessage.includes('API') || 
        logMessage.includes('response') ||
        logMessage.includes('payload') ||
        logMessage.includes('markdown')
      ) {
        setLogs(prevLogs => [
          ...prevLogs,
          {
            type: 'log',
            time: new Date().toLocaleTimeString(),
            content: formatLogContent(args)
          }
        ]);
      }
    };
    
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError(...args);
      
      // Store all error logs
      setLogs(prevLogs => [
        ...prevLogs,
        {
          type: 'error',
          time: new Date().toLocaleTimeString(),
          content: formatLogContent(args)
        }
      ]);
    };
    
    return () => {
      // Restore original console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }, []);
  
  // Format log content based on type
  const formatLogContent = (args) => {
    return args.map(arg => {
      if (arg === null) return 'null';
      if (arg === undefined) return 'undefined';
      
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return String(arg);
        }
      }
      
      return String(arg);
    }).join(' ');
  };
  
  // Toggle debug panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };
  
  return (
    <div className={`api-debug-viz ${isOpen ? 'open' : 'closed'}`}>
      <button className="debug-toggle" onClick={togglePanel}>
        {isOpen ? 'Hide API Debug' : 'Show API Debug'}
      </button>
      
      {isOpen && (
        <div className="debug-panel">
          <div className="debug-header">
            <h3>API Debug Console</h3>
            <button className="debug-clear" onClick={clearLogs}>Clear</button>
          </div>
          
          <div className="debug-logs">
            {logs.length === 0 ? (
              <div className="debug-empty">No API logs yet.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`debug-log ${log.type}`}>
                  <span className="debug-time">{log.time}</span>
                  <pre className="debug-content">{log.content}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDebugViz;