import React from 'react';
import { useConversations } from '../../contexts/ConversationContext';
import { truncateText } from '../../utils/formatters';
import './Sidebar.css';

/**
 * Sidebar component showing conversation history
 */
const Sidebar = ({ isOpen }) => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    createConversation,
    deleteConversation
  } = useConversations();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button 
          className="new-chat-button"
          onClick={createConversation}
        >
          New Chat
        </button>
      </div>
      
      <div className="conversations-list">
        {conversations.map(conversation => (
          <div 
            key={conversation.id}
            className={`conversation-item ${conversation.id === activeConversationId ? 'active' : ''}`}
          >
            <div 
              className="conversation-content"
              onClick={() => setActiveConversationId(conversation.id)}
            >
              <div className="conversation-title">
                {truncateText(conversation.title, 25)}
              </div>
              
              <div className="conversation-preview">
                {conversation.messages.length > 0 
                  ? truncateText(conversation.messages[conversation.messages.length - 1].content, 30)
                  : 'No messages yet'}
              </div>
            </div>
            
            <button
              className="delete-conversation-button"
              onClick={() => deleteConversation(conversation.id)}
              aria-label="Delete conversation"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;