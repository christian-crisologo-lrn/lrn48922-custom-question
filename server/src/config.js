/**
 * Server configuration
 * Environment variables can be used to override defaults
 */

const DEFAULT = {
  PORT: 3004,
  HOST: 'localhost',
  PROTOCOL: 'http',
  LEARNOSITY_CONSUMER_KEY: 'yis0TYCu7U9V4o7M',
  LEARNOSITY_SECRET: '74c5fd430cf1242a527f6223aebd42d30464be22',
  LEARNOSITY_DOMAIN: 'localhost',
  CORS_ORIGINS: 'http://localhost:8080,http://localhost:8081,http://localhost:3000',
}

const CORS_ORIGINS = DEFAULT.CORS_ORIGINS.split(',');
/**
 * Get the server port from environment variable or default
 * @returns {number} The port number
 */
function getPort() {
  return parseInt(process.env.PORT || DEFAULT.PORT, 10);
}

/**
 * Get the server host from environment variable or default
 * @returns {string} The host address
 */
function getHost() {
  return process.env.HOST || DEFAULT.HOST;
}

/**
 * Get the server URL
 * @returns {string} The full server URL
 */
function getServerUrl() {
  const port = getPort();
  const host = getHost();
  const protocol = process.env.PROTOCOL || 'http';
  
  // Don't include port in URL if it's the default for the protocol
  if ((protocol === 'http' && port === 80) || (protocol === 'https' && port === 443)) {
    return `${protocol}://${host}`;
  }
  
  return `${protocol}://${host}:${port}`;
}

/**
 * Get Learnosity credentials
 * @returns {object} Object containing consumer_key and secret
 */
function getLearnosityCredentials() {
  return {
    consumerKey: process.env.LEARNOSITY_CONSUMER_KEY || DEFAULT.LEARNOSITY_CONSUMER_KEY,
    secret: process.env.LEARNOSITY_SECRET || DEFAULT.LEARNOSITY_SECRET,
  };
}

/**
 * Get the domain for Learnosity requests
 * @returns {string} The domain
 */
function getLearnosityDomain() {
  return process.env.LEARNOSITY_DOMAIN || getHost();
}

/**
 * Get CORS configuration
 * @returns {object} CORS options
 */
function getCorsOptions() {
  const allowedOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',')
    : CORS_ORIGINS;
  
  return {
    origin: allowedOrigins,
    credentials: true,
  };
}

module.exports = {
  getPort,
  getHost,
  getServerUrl,
  getLearnosityCredentials,
  getLearnosityDomain,
  getCorsOptions,
};

