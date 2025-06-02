/**
 * Enhanced Chat API service with better error handling
 * Handles all API calls to the chat backend
 */
import { getApiEndpoint } from './config';

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
  // 3. HTML error page (detect and handle)
  if (typeof data === 'string') {
    // Check if it's HTML (error page)
    if (data.trim().toLowerCase().startsWith('<!doctype html') || 
        data.trim().toLowerCase().startsWith('<html')) {
      return 'Error: The API returned an HTML page instead of a response. Please check your API endpoint URL.';
    }
    
    // Try to parse as JSON first, in case it's a JSON string
    try {
      const parsedData = JSON.parse(data);
      
      // If successfully parsed, recursively extract from the parsed object
      return extractResponseContent(parsedData);
    } catch (e) {
      // Not valid JSON, return as plain text (if it's not HTML)
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
 * Validate API endpoint URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL appears to be a valid API endpoint
 */
const validateApiEndpoint = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Check if it looks like an API endpoint
    const path = urlObj.pathname.toLowerCase();
    
    // Common API patterns
    const apiPatterns = [
      '/api/',
      '/v1/',
      '/v2/',
      '/run/',
      '/chat/',
      '/invoke'
    ];
    
    return apiPatterns.some(pattern => path.includes(pattern));
  } catch (e) {
    return false;
  }
};

/**
 * Send a message to the chat API
 * @param {string} message - The message content to send
 * @param {string} sessionId - The session ID for this conversation
 * @returns {Promise<Object>} - The API response
 */
export const sendChatMessage = async (message, sessionId) => {
  try {
    const apiEndpoint = getApiEndpoint();
    
    // Validate the API endpoint
    if (!validateApiEndpoint(apiEndpoint)) {
      throw new Error(`Invalid API endpoint format: ${apiEndpoint}. Please check your configuration.`);
    }
    
    const payload = {
      "input_value": message,
      "output_type": "chat",
      "input_type": "chat",
      "session_id": sessionId
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    
    console.log('Sending request to:', apiEndpoint);
    console.log('With payload:', payload);
    
    const response = await fetch(apiEndpoint, options);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Check content type
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (!response.ok) {
      // Try to get error details
      let errorMessage = `API responded with status: ${response.status}`;
      
      try {
        const errorText = await response.text();
        if (errorText.includes('<!doctype html') || errorText.includes('<html')) {
          errorMessage += '. The server returned an HTML page instead of JSON. Please verify your API endpoint URL.';
        } else {
          errorMessage += `. Error: ${errorText}`;
        }
      } catch (e) {
        // Ignore error text parsing errors
      }
      
      throw new Error(errorMessage);
    }
    
    // Check if response is HTML instead of JSON
    if (contentType && contentType.includes('text/html')) {
      throw new Error('API returned HTML instead of JSON. Please check your API endpoint URL - it may be pointing to a web interface instead of the API.');
    }
    
    // Get response text first
    const responseText = await response.text();
    console.log('Raw API response text:', responseText);
    
    // Check if response is HTML
    if (responseText.trim().toLowerCase().startsWith('<!doctype html') || 
        responseText.trim().toLowerCase().startsWith('<html')) {
      throw new Error('API returned an HTML page instead of JSON. Your API endpoint URL may be incorrect. Please check your configuration file.');
    }
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed API response:', data);
    } catch (e) {
      // If it's not valid JSON, check if it's an error message
      if (responseText.includes('error') || responseText.includes('Error')) {
        throw new Error(`API Error: ${responseText}`);
      }
      
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
    
    // Provide more helpful error messages
    if (error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to the API at ${getApiEndpoint()}. Please check your internet connection and API endpoint.`);
    }
    
    throw error;
  }
};

/**
 * Test the API endpoint connectivity
 * @returns {Promise<Object>} - Test result
 */
export const testApiEndpoint = async () => {
  try {
    const apiEndpoint = getApiEndpoint();
    
    console.log('Testing API endpoint:', apiEndpoint);
    
    // Simple connectivity test
    const response = await fetch(apiEndpoint, {
      method: 'HEAD',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    return {
      success: true,
      status: response.status,
      message: `API endpoint is reachable (Status: ${response.status})`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: `Failed to reach API endpoint: ${error.message}`
    };
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