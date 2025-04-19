/**
 * Format a timestamp to a readable time
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} - Formatted time string
 */
export const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  /**
   * Format a timestamp to a readable date
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} - Formatted date string
   */
  export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  /**
   * Format a timestamp to a readable date and time
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} - Formatted date and time string
   */
  export const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  /**
   * Truncate text to a certain length
   * @param {string} text - Text to truncate
   * @param {number} length - Max length before truncation
   * @returns {string} - Truncated text
   */
  export const truncateText = (text, length = 30) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };
  
  /**
   * Create a message title from content
   * @param {string} content - Message content
   * @returns {string} - Generated title
   */
  export const createMessageTitle = (content) => {
    // Remove markdown characters 
    let plainText = content
      .replace(/#+\s/g, '') // Remove heading marks
      .replace(/\*\*/g, '') // Remove bold marks
      .replace(/\*/g, '')   // Remove italic marks
      .replace(/`{3}[\s\S]*?`{3}/g, 'Code block') // Replace code blocks
      .replace(/`([^`]+)`/g, '$1')  // Remove inline code marks
      .trim();
    
    return truncateText(plainText, 30);
  };