/**
 * Generate a unique session ID
 * @param {string} prefix - Optional prefix for the session ID
 * @returns {string} - Unique session ID
 */
export const generateSessionId = (prefix = 'user') => {
    const randomPart = Math.random().toString(36).substring(2, 9);
    const timestamp = Date.now().toString(36);
    return `${prefix}_${randomPart}_${timestamp}`;
  };
  
  /**
   * Store session data in local storage
   * @param {string} sessionId - Session ID
   * @param {Object} data - Session data to store
   */
  export const storeSessionData = (sessionId, data) => {
    try {
      // Get existing sessions or initialize empty object
      const sessions = JSON.parse(localStorage.getItem('chat_sessions') || '{}');
      
      // Update session data
      sessions[sessionId] = {
        ...sessions[sessionId],
        ...data,
        lastUpdated: new Date().toISOString()
      };
      
      // Save back to localStorage
      localStorage.setItem('chat_sessions', JSON.stringify(sessions));
      
      return true;
    } catch (error) {
      console.error('Error storing session data:', error);
      return false;
    }
  };
  
  /**
   * Retrieve session data from local storage
   * @param {string} sessionId - Session ID
   * @returns {Object|null} - Session data or null if not found
   */
  export const getSessionData = (sessionId) => {
    try {
      const sessions = JSON.parse(localStorage.getItem('chat_sessions') || '{}');
      return sessions[sessionId] || null;
    } catch (error) {
      console.error('Error retrieving session data:', error);
      return null;
    }
  };
  
  /**
   * Delete session data from local storage
   * @param {string} sessionId - Session ID
   * @returns {boolean} - Success status
   */
  export const deleteSessionData = (sessionId) => {
    try {
      const sessions = JSON.parse(localStorage.getItem('chat_sessions') || '{}');
      
      if (sessions[sessionId]) {
        delete sessions[sessionId];
        localStorage.setItem('chat_sessions', JSON.stringify(sessions));
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting session data:', error);
      return false;
    }
  };