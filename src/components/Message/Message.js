import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatTime } from '../../utils/formatters';
import './Message.css';

/**
 * Enhanced message component with better markdown handling
 */
const Message = ({ message }) => {
  const { role, content, timestamp, isError } = message;
  
  // Process the message content
  const processContent = (content) => {
    if (!content) return '';
    
    // If it's a JSON string, try to extract text
    if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
      try {
        const jsonData = JSON.parse(content);
        // Look for content in common API response fields
        if (jsonData.text) return jsonData.text;
        if (jsonData.content) return jsonData.content;
        if (jsonData.message) {
          if (typeof jsonData.message === 'string') return jsonData.message;
          if (jsonData.message.text) return jsonData.message.text;
          if (jsonData.message.content) return jsonData.message.content;
        }
        // If we couldn't find content, stringify the JSON with indentation
        return JSON.stringify(jsonData, null, 2);
      } catch (e) {
        // Not valid JSON, use as is
        return content;
      }
    }
    
    // Regular string content
    return content;
  };

  // Process the message content
  const processedContent = processContent(content);

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
          <p>{processedContent}</p>
        ) : (
          <ReactMarkdown components={components}>
            {processedContent}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default Message;