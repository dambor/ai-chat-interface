import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import './BasicChat.css';

/**
 * Basic chat page component with minimal features
 */
const BasicChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [sessionId] = useState(`user_${Math.random().toString(36).substring(2, 9)}`);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to API
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { 
      id: Date.now().toString(),
      role: 'user', 
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await sendChatMessage(inputValue, sessionId);
      
      // Add assistant response to chat
      const assistantMessage = { 
        id: (Date.now() + 1).toString(),
        role: 'assistant', 
        content: response.output,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Add error message to chat
      const errorMessage = { 
        id: (Date.now() + 1).toString(),
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="basic-chat">
      <header className="basic-header">
        <h1>AI Assistant</h1>
      </header>
      
      <main className="basic-chat-container">
        <div className="basic-messages">
          {messages.length === 0 ? (
            <div className="basic-welcome-message">
              <h2>Welcome to AI Assistant</h2>
              <p>Ask me anything to get started!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`basic-message ${message.role === 'user' ? 'basic-user-message' : 'basic-assistant-message'} ${message.isError ? 'error' : ''}`}
              >
                <div className="basic-message-content">
                  {message.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="basic-message basic-assistant-message">
              <div className="basic-message-content">
                <div className="basic-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <footer className="basic-input-container">
        <div className="basic-input-wrapper">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message AI Assistant..."
            rows={1}
            className="basic-message-input"
          />
          <button 
            onClick={handleSendMessage}
            disabled={inputValue.trim() === '' || isLoading}
            className="basic-send-button"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BasicChat;