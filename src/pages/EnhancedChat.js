import React from 'react';
import MessageList from '../components/MessageList/MessageList';
import ChatInput from '../components/ChatInput/ChatInput';
import { useChat } from '../hooks/useChat';
import { useConversations } from '../contexts/ConversationContext';
import './EnhancedChat.css';

/**
 * Enhanced chat page component without header (header is now in MainLayout)
 */
const EnhancedChat = () => {
  const { activeConversation } = useConversations();
  const { isLoading, sendMessage, messagesEndRef, error } = useChat();
  
  return (
    <div className="enhanced-chat">
      <main className="chat-main">
        <MessageList 
          messages={activeConversation ? activeConversation.messages : []}
          isLoading={isLoading}
          error={error}
          messagesEndRef={messagesEndRef}
        />
      </main>
      
      <footer className="chat-footer">
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default EnhancedChat;