/**
 * Chat API service
 * Handles all API calls to the chat backend
 */

// API endpoint - can be updated at runtime
let API_ENDPOINT = 'http://127.0.0.1:7860/api/v1/run/6f17d4f7-284b-40e3-9b81-213baf319f2c';

/**
 * Update the API endpoint
 * @param {string} newEndpoint - The new API endpoint URL
 */
export const updateApiEndpoint = (newEndpoint) => {
  if (newEndpoint && typeof newEndpoint === 'string') {
    API_ENDPOINT = newEndpoint;
    console.log('API endpoint updated to:', API_ENDPOINT);
    return true;
  }
  return false;
};

/**
 * Get the current API endpoint
 * @returns {string} - The current API endpoint URL
 */
export const getApiEndpoint = () => {
  return API_ENDPOINT;
};

/**
 * Extract the API response content from various response formats
 * @param {Object|string} data - The API response data
 * @returns {string} - The extracted content
 */
export const extractResponseContent = (data) => {
  console.log('Extracting content from response:', data);
  
  // If data is a string, return it directly
  if (typeof data === 'string') {
    return data;
  }
  
  // If data is null or undefined
  if (!data) {
    return 'Empty response received from the API.';
  }
  
  // If data is an object, try to extract the content
  if (typeof data === 'object') {
    // Check common response formats
    const possibleFields = [
      'output', 'response', 'answer', 'message', 'text', 'content',
      'result', 'data', 'reply', 'generation', 'completion'
    ];
    
    // Try each field
    for (const field of possibleFields) {
      if (data[field] !== undefined) {
        if (typeof data[field] === 'string') {
          return data[field];
        } else if (typeof data[field] === 'object') {
          // Try to stringify nested object
          try {
            return JSON.stringify(data[field], null, 2);
          } catch (e) {
            // Continue to next field if stringify fails
            continue;
          }
        }
      }
    }
    
    // If we couldn't find a matching field, return the whole object
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return 'Received response in an unknown format.';
    }
  }
  
  // Fallback
  return 'Received response in an unknown format.';
};

/**
 * Send a message to the chat API
 * @param {string} message - The message content to send
 * @param {string} sessionId - The session ID for this conversation
 * @returns {Promise<Object>} - The API response
 */
export const sendChatMessage = async (message, sessionId) => {
  try {
    const payload = {
      "input_value": message,
      "output_type": "chat",
      "input_type": "chat",
      "session_id": sessionId
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    
    console.log('Sending request to:', API_ENDPOINT);
    console.log('With payload:', payload);
    
    const response = await fetch(API_ENDPOINT, options);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    // Get response text first
    const responseText = await response.text();
    console.log('Raw API response text:', responseText);
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed API response:', data);
    } catch (e) {
      // If it's not valid JSON, use the text directly
      console.log('Response is not valid JSON, using text directly');
      data = responseText;
    }
    
    // Extract the content from the response
    const extractedContent = extractResponseContent(data);
    console.log('Extracted content:', extractedContent);
    
    return { output: extractedContent };
  } catch (error) {
    console.error('Error sending message to API:', error);
    throw error;
  }
};

/**
 * Initialize a new chat session
 * @returns {Promise<Object>} - The API response
 */
export const initializeSession = async () => {
  try {
    const sessionId = `user_${Math.random().toString(36).substring(2, 9)}`;
    return { sessionId };
  } catch (error) {
    console.error('Error initializing session:', error);
    // Return a fallback session ID even if the API call fails
    return {
      sessionId: `user_${Math.random().toString(36).substring(2, 9)}`
    };
  }
};