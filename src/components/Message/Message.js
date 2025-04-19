import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatTime } from '../../utils/formatters';
import './Message.css';

/**
 * Simplified message component with better markdown handling
 */
const Message = ({ message }) => {
  const { role, content, timestamp, isError } = message;
  
  // Custom renderer components for ReactMarkdown
  const components = {
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    // Ensure tables render properly
    table({node, ...props}) {
      return (
        <div className="table-container">
          <table {...props} />
        </div>
      );
    }
  };

  return (
    <div className={`message ${role === 'user' ? 'user-message' : 'assistant-message'} ${isError ? 'error' : ''}`}>
      <div className="message-header">
        <span className="message-sender">{role === 'user' ? 'You' : 'AI Assistant'}</span>
        <span className="message-time">{formatTime(timestamp)}</span>
      </div>
      <div className="message-content">
        {role === 'user' ? (
          <p>{content}</p>
        ) : (
          <ReactMarkdown components={components}>
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default Message;