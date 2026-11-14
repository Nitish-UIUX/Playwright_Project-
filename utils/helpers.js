/**
 * Wait for a specific amount of time
 * @param {number} ms - Milliseconds to wait
 */
export async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a random string
 * @param {number} length - Length of the string
 */
export function generateRandomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random email
 */
export function generateRandomEmail() {
  return `test.${generateRandomString(8)}@example.com`;
}

/**
 * Generate a random phone number
 */
export function generateRandomPhone() {
  return `555${Math.floor(Math.random() * 9000000) + 1000000}`;
}

/**
 * Retry a function with exponential backoff
 * @param {function} fn - The function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} delay - Initial delay in milliseconds
 */
export async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await wait(delay * attempt);
    }
  }
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - The date to format
 */
export function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current timestamp
 */
export function getCurrentTimestamp() {
  return new Date().toISOString();
}

/**
 * Parse URL query parameters
 * @param {string} url - The URL to parse
 */
export function parseQueryParams(url) {
  const params = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
  }
  return params;
}
