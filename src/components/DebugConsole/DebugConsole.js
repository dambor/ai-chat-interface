import React, { useState, useEffect } from 'react';
import './DebugConsole.css';

/**
 * Debug console for API requests and responses
 */
const DebugConsole = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  
  // Intercept console logs
  useEffect(() => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    // Create timestamp formatter
    const formatTime = () => {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };
    
    // Override console.log
    console.log = (...args) => {
      // Call original console.log
      originalConsoleLog(...args);
      
      // Add to our logs
      setLogs(prevLogs => [
        ...prevLogs, 
        { 
          type: 'log',
          time: formatTime(),
          content: args.map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch (e) {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ')
        }
      ]);
    };
    
    // Override console.error
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError(...args);
      
      // Add to our logs
      setLogs(prevLogs => [
        ...prevLogs, 
        { 
          type: 'error',
          time: formatTime(),
          content: args.map(arg => {
            if (arg instanceof Error) {
              return arg.message;
            }
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch (e) {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ')
        }
      ]);
    };
    
    // Restore original console methods on cleanup
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    };
  }, []);
  
  const toggleConsole = () => {
    setIsOpen(!isOpen);
  };
  
  const clearLogs = () => {
    setLogs([]);
  };
  
  return (
    <div className={`debug-console ${isOpen ? 'open' : 'closed'}`}>
      <button className="debug-toggle" onClick={toggleConsole}>
        {isOpen ? 'Hide Debug' : 'Show Debug'}
      </button>
      
      {isOpen && (
        <div className="debug-content">
          <div className="debug-header">
            <h3>Debug Console</h3>
            <button className="debug-clear" onClick={clearLogs}>Clear</button>
          </div>
          
          <div className="debug-logs">
            {logs.length === 0 ? (
              <div className="debug-empty">No logs yet.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`debug-log ${log.type}`}>
                  <span className="debug-time">{log.time}</span>
                  <pre className="debug-message">{log.content}</pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugConsole;