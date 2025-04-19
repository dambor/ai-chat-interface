import React from 'react';
import './TypingIndicator.css';
import { formatTime } from '../../utils/formatters';

/**
 * Typing indicator component for showing that the AI is responding
 */
const TypingIndicator = () => {
  return (
    <div className="message assistant-message typing-message">
      <div className="message-header">
        <span className="message-sender">AI Assistant</span>
        <span className="message-time">{formatTime(new Date().toISOString())}</span>
      </div>
      <div className="message-content">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;