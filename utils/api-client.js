import axios from 'axios';
import { getConfig } from '../config/environment.js';

class APIClient {
  constructor() {
    const config = getConfig();
    this.baseURL = config.apiURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  /**
   * Make a GET request
   * @param {string} endpoint - The API endpoint
   * @param {object} config - Optional axios config
   */
  async get(endpoint, config = {}) {
    try {
      const response = await this.client.get(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`GET request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Make a POST request
   * @param {string} endpoint - The API endpoint
   * @param {object} data - The request body
   * @param {object} config - Optional axios config
   */
  async post(endpoint, data = {}, config = {}) {
    try {
      const response = await this.client.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - The API endpoint
   * @param {object} data - The request body
   * @param {object} config - Optional axios config
   */
  async put(endpoint, data = {}, config = {}) {
    try {
      const response = await this.client.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - The API endpoint
   * @param {object} config - Optional axios config
   */
  async delete(endpoint, config = {}) {
    try {
      const response = await this.client.delete(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Set authorization header
   * @param {string} token - The auth token
   */
  setAuthToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authorization header
   */
  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

export default new APIClient();
