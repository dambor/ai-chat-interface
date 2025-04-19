import React, { createContext, useState, useContext } from 'react';

const ConversationContext = createContext();

export const useConversations = () => useContext(ConversationContext);

export const ConversationProvider = ({ children }) => {
  // State to manage all conversations
  const [conversations, setConversations] = useState([
    { id: 'default', title: 'New conversation', messages: [] }
  ]);
  
  // State to track the active conversation
  const [activeConversationId, setActiveConversationId] = useState('default');
  
  // Get the currently active conversation
  const activeConversation = conversations.find(conv => conv.id === activeConversationId);
  
  // Create a new conversation
  const createConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: []
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
    
    return newConversation.id;
  };
  
  // Add a message to a conversation
  const addMessage = (conversationId, message) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === conversationId) {
          // Update conversation title if it's the first message and it's from the user
          const title = conv.messages.length === 0 && message.role === 'user'
            ? message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '')
            : conv.title;
          
          return {
            ...conv,
            title,
            messages: [...conv.messages, message]
          };
        }
        return conv;
      })
    );
  };
  
  // Delete a conversation
  const deleteConversation = (conversationId) => {
    setConversations(prevConversations => 
      prevConversations.filter(conv => conv.id !== conversationId)
    );
    
    // If we deleted the active conversation, switch to the first one
    if (conversationId === activeConversationId) {
      const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
      if (remainingConversations.length > 0) {
        setActiveConversationId(remainingConversations[0].id);
      } else {
        // Create a new conversation if we've deleted all of them
        createConversation();
      }
    }
  };
  
  // Clear all messages in a conversation
  const clearConversation = (conversationId) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            title: 'New conversation',
            messages: []
          };
        }
        return conv;
      })
    );
  };
  
  // Rename a conversation
  const renameConversation = (conversationId, newTitle) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            title: newTitle
          };
        }
        return conv;
      })
    );
  };
  
  return (
    <ConversationContext.Provider value={{
      conversations,
      activeConversationId,
      activeConversation,
      setActiveConversationId,
      createConversation,
      addMessage,
      deleteConversation,
      clearConversation,
      renameConversation
    }}>
      {children}
    </ConversationContext.Provider>
  );
};