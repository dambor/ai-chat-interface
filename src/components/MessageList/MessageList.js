import React from 'react';
import Message from '../Message/Message';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import './MessageList.css';

/**
 * Component for displaying a list of messages
 */
const MessageList = ({ messages, isLoading, error, messagesEndRef }) => {
  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="welcome-message">
          <h2>Welcome to AI Assistant</h2>
          <p>Ask me anything to get started!</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          
          {isLoading && <TypingIndicator />}
          
          {error && (
            <div className="error-message">
              Error: {error}
            </div>
          )}
        </>
      )}
      
      {/* This ref is used to scroll to the bottom of the messages */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;