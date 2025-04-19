import { useState, useCallback, useRef, useEffect } from 'react';
import { useConversations } from '../contexts/ConversationContext';
import { sendChatMessage } from '../services/api';
import { generateSessionId, storeSessionData } from '../utils/sessionManager';

/**
 * Custom hook for chat functionality
 * @returns {Object} - Chat functionality
 */
export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Get conversation context
  const { activeConversationId, activeConversation, addMessage } = useConversations();
  
  // Store session IDs for each conversation
  const [sessionIds, setSessionIds] = useState({});
  
  // Generate or retrieve a session ID for a conversation
  const getSessionId = useCallback((conversationId) => {
    if (sessionIds[conversationId]) {
      return sessionIds[conversationId];
    }
    
    const newSessionId = generateSessionId(conversationId);
    setSessionIds(prev => ({
      ...prev,
      [conversationId]: newSessionId
    }));
    
    return newSessionId;
  }, [sessionIds]);
  
  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  
  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, scrollToBottom]);
  
  // Send a message to the API
  const sendMessage = useCallback(async (messageContent) => {
    if (!messageContent || !messageContent.trim()) {
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Create user message
      const userMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: messageContent,
        timestamp: new Date().toISOString()
      };
      
      // Add user message to the conversation
      addMessage(activeConversationId, userMessage);
      
      // Get session ID for the conversation
      const sessionId = getSessionId(activeConversationId);
      
      // Store session data
      storeSessionData(sessionId, {
        conversationId: activeConversationId,
        lastMessage: messageContent
      });
      
      // Send message to API
      const response = await sendChatMessage(messageContent, sessionId);
      
      console.log('Processed API response:', response);
      
      // Determine content for assistant message
      let assistantContent = "Sorry, I received an empty response.";
      
      if (response && response.output) {
        if (typeof response.output === 'string' && response.output.trim() !== '') {
          assistantContent = response.output;
        } else if (typeof response.output === 'object') {
          assistantContent = JSON.stringify(response.output, null, 2);
        }
      }
      
      // Create assistant message
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date().toISOString()
      };
      
      // Add assistant message to the conversation
      addMessage(activeConversationId, assistantMessage);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
      
      // Create error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message || 'An unknown error occurred while processing your request.'}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      // Add error message to the conversation
      addMessage(activeConversationId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, addMessage, getSessionId]);
  
  return {
    isLoading,
    error,
    sendMessage,
    messagesEndRef
  };
};