import React, { useEffect } from 'react';
import { useConversations } from '../../contexts/ConversationContext';
import { truncateText } from '../../utils/formatters';
import './Sidebar.css';

/**
 * Sidebar component with proper open/close functionality
 */
const Sidebar = ({ isOpen, onClose, onOpen }) => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    createConversation,
    deleteConversation
  } = useConversations();

  // Close sidebar when clicking overlay (mobile)
  useEffect(() => {
    const handleOverlayClick = (e) => {
      if (e.target.classList.contains('sidebar-overlay') && isOpen) {
        onClose();
      }
    };

    document.addEventListener('click', handleOverlayClick);
    return () => {
      document.removeEventListener('click', handleOverlayClick);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleConversationClick = (conversationId) => {
    setActiveConversationId(conversationId);
    
    // Close sidebar on mobile after selection
    const isMobile = window.innerWidth <= 768;
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleNewChat = () => {
    createConversation();
    
    // Close sidebar on mobile after creating new chat
    const isMobile = window.innerWidth <= 768;
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleDeleteConversation = (e, conversationId) => {
    e.stopPropagation(); // Prevent conversation selection
    deleteConversation(conversationId);
  };

  return (
    <>
      {/* Overlay for mobile - only show when sidebar is open */}
      {isOpen && <div className="sidebar-overlay" />}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
        <div className="sidebar-header">
          <button 
            className="new-chat-button"
            onClick={handleNewChat}
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
                onClick={() => handleConversationClick(conversation.id)}
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
                onClick={(e) => handleDeleteConversation(e, conversation.id)}
                aria-label="Delete conversation"
              >
                ×
              </button>
            </div>
          ))}
          
          {conversations.length === 0 && (
            <div style={{
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              color: 'var(--color-gray-400)',
              fontSize: 'var(--font-size-sm)'
            }}>
              No conversations yet
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;