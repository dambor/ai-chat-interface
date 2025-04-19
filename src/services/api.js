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
  
  // Handle null/undefined case
  if (data === null || data === undefined) {
    return 'Empty response received from the API.';
  }
  
  // If data is a string, it might be:
  // 1. Plain text response
  // 2. JSON string that needs parsing
  if (typeof data === 'string') {
    // Try to parse as JSON first, in case it's a JSON string
    try {
      const parsedData = JSON.parse(data);
      
      // If successfully parsed, recursively extract from the parsed object
      return extractResponseContent(parsedData);
    } catch (e) {
      // Not valid JSON, return as plain text
      return data;
    }
  }
  
  // If data is an object
  if (typeof data === 'object') {
    // First check for specific complex API structures (like the provided example)
    // Check for session_id and outputs array pattern
    if (data.session_id && Array.isArray(data.outputs)) {
      // Navigate complex nested structure (common in advanced AI APIs)
      try {
        const firstOutput = data.outputs[0];
        
        // Check for different output structures
        if (firstOutput.outputs && Array.isArray(firstOutput.outputs)) {
          const innerOutput = firstOutput.outputs[0];
          
          // Try to extract text from various common API patterns
          if (innerOutput.results?.message?.text) {
            return innerOutput.results.message.text;
          }
          
          if (innerOutput.results?.message?.data?.text) {
            return innerOutput.results.message.data.text;
          }
          
          if (innerOutput.artifacts?.message) {
            return innerOutput.artifacts.message;
          }
          
          // Check messages array
          if (innerOutput.messages && Array.isArray(innerOutput.messages)) {
            if (innerOutput.messages[0]?.message) {
              return innerOutput.messages[0].message;
            }
          }
        }
        
        // Direct artifacts pattern
        if (firstOutput.artifacts?.message) {
          return firstOutput.artifacts.message;
        }
      } catch (e) {
        console.log('Error parsing complex API structure:', e);
        // Continue to standard extraction methods
      }
    }
    
    // Common response fields ordered by priority
    const possibleFields = [
      'output', 'response', 'text', 'content', 'message',
      'answer', 'result', 'data', 'reply', 'generation', 'completion',
      'artifacts'
    ];
    
    // Check for direct content fields
    for (const field of possibleFields) {
      if (data[field] !== undefined) {
        const fieldValue = data[field];
        
        // If the field value is a string, return it
        if (typeof fieldValue === 'string') {
          return fieldValue;
        }
        
        // Special handling for message field structure
        if (field === 'message' && typeof fieldValue === 'object') {
          if (fieldValue.text) return fieldValue.text;
          if (fieldValue.content) return fieldValue.content;
          if (fieldValue.data?.text) return fieldValue.data.text;
        }
        
        // Special handling for artifacts field structure
        if (field === 'artifacts' && typeof fieldValue === 'object') {
          if (fieldValue.message) return fieldValue.message;
        }
        
        // If the field value is an object, convert to prettified JSON
        if (typeof fieldValue === 'object' && fieldValue !== null) {
          // Try to further extract content from this nested object
          const nestedContent = extractResponseContent(fieldValue);
          
          // If we got a meaningful extraction, return it
          if (nestedContent && nestedContent !== 'Received response in an unknown format.') {
            return nestedContent;
          }
          
          // Otherwise return the prettified JSON
          try {
            return JSON.stringify(fieldValue, null, 2);
          } catch (e) {
            // If stringify fails, continue to the next field
            continue;
          }
        }
      }
    }
    
    // If we couldn't extract content through known fields, check if this is an array
    if (Array.isArray(data)) {
      // For arrays, extract the first item or concatenate string values
      if (data.length > 0) {
        if (typeof data[0] === 'string') {
          return data.join('\n\n');
        } else {
          return extractResponseContent(data[0]);
        }
      }
    }
    
    // As a last resort, return the whole object as formatted JSON
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return 'Received response in an unknown format.';
    }
  }
  
  // Fallback for unexpected data types
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