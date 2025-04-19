import React, { useState, useRef, useEffect } from 'react';
import './ChatInput.css';

/**
 * Enhanced chat input component with input validation
 */
const ChatInput = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to correctly calculate the new height
      textareaRef.current.style.height = 'auto';
      // Set new height based on scrollHeight
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);
  
  // Handle sending message with input validation
  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      // Make sure input is a string (not a number)
      const validInput = String(inputValue.trim());
      onSendMessage(validInput);
      setInputValue('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  // Handle Enter key press (send on Enter, new line on Shift+Enter)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle input change with validation
  const handleInputChange = (e) => {
    // Always store as string
    const value = String(e.target.value);
    setInputValue(value);
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Message AI Assistant..."
          className="chat-input-textarea"
          disabled={isLoading}
        />
        <button 
          className="chat-input-send-button"
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          aria-label="Send message"
        >
          Send
        </button>
      </div>
      <div className="chat-input-hint">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default ChatInput;