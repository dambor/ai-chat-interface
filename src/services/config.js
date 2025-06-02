/**
 * Configuration service for loading app configuration
 */

let appConfig = null;

// Default configuration as fallback
const DEFAULT_CONFIG = {
  apiEndpoint: 'http://127.0.0.1:7860/api/v1/run/6f17d4f7-284b-40e3-9b81-213baf319f2c',
  appTitle: 'AI Chat Interface',
  features: {
    enableDebugMode: false,
    enableMarkdownSupport: true,
    maxMessageLength: 4000,
    autoSaveConversations: true
  },
  ui: {
    theme: 'light',
    sidebarDefaultOpen: true,
    showTypingIndicator: true
  }
};

/**
 * Load configuration from public/config.json
 * @returns {Promise<Object>} Configuration object
 */
export const loadConfig = async () => {
  if (appConfig) {
    return appConfig;
  }

  try {
    console.log('Loading configuration from /config.json...');
    
    const response = await fetch('/config.json', {
      cache: 'no-cache', // Ensure we get the latest config
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status}`);
    }

    const config = await response.json();
    
    // Merge with defaults to ensure all required fields exist
    appConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      features: {
        ...DEFAULT_CONFIG.features,
        ...(config.features || {})
      },
      ui: {
        ...DEFAULT_CONFIG.ui,
        ...(config.ui || {})
      }
    };

    console.log('Configuration loaded successfully:', appConfig);
    return appConfig;
    
  } catch (error) {
    console.warn('Failed to load configuration file, using defaults:', error.message);
    appConfig = DEFAULT_CONFIG;
    return appConfig;
  }
};

/**
 * Get the current configuration
 * @returns {Object} Current configuration object
 */
export const getConfig = () => {
  if (!appConfig) {
    console.warn('Configuration not loaded yet, returning defaults');
    return DEFAULT_CONFIG;
  }
  return appConfig;
};

/**
 * Get API endpoint from configuration
 * @returns {string} API endpoint URL
 */
export const getApiEndpoint = () => {
  const config = getConfig();
  return config.apiEndpoint;
};

/**
 * Get app title from configuration
 * @returns {string} App title
 */
export const getAppTitle = () => {
  const config = getConfig();
  return config.appTitle;
};

/**
 * Get feature flags from configuration
 * @returns {Object} Feature flags object
 */
export const getFeatures = () => {
  const config = getConfig();
  return config.features;
};

/**
 * Get UI configuration
 * @returns {Object} UI configuration object
 */
export const getUIConfig = () => {
  const config = getConfig();
  return config.ui;
};

/**
 * Check if a specific feature is enabled
 * @param {string} featureName - Name of the feature to check
 * @returns {boolean} Whether the feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  const features = getFeatures();
  return features[featureName] || false;
};

/**
 * Reload configuration (useful for development)
 * @returns {Promise<Object>} New configuration object
 */
export const reloadConfig = async () => {
  appConfig = null;
  return await loadConfig();
};