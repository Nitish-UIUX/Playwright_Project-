
import { test as base, expect } from '@playwright/test';
import { getConfig } from '../config/environment.js';
import { apiCredentials } from '../test-data/api-data.js';

const envConfig = getConfig();

// Reusable API context factory
async function createApiContext(playwright, token = null) {

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return await playwright.request.newContext({
    baseURL: envConfig.apiURL,
    extraHTTPHeaders: headers,
    timeout: envConfig.timeout,
  });
}

export const test = base.extend({

  // Reusable API context
  apiRequest: async ({ playwright }, use) => {

    const apiContext = await createApiContext(playwright);

    try {
      await use(apiContext);
    } finally {
      await apiContext.dispose();
    }

  },

  // Reusable authentication token
  authToken: async ({ apiRequest }, use) => {

    const response = await apiRequest.post('/auth/login', {
      data: {
        username: apiCredentials.username,
        password: apiCredentials.password,
      },
    });

    expect(response.status()).toBe(200);

    const loginData = await response.json();

    expect(loginData.accessToken).toBeDefined();

    await use(loginData.accessToken);

  },

  // Authenticated API context
  authenticatedRequest: async ({ playwright, authToken }, use) => {

    const apiContext = await createApiContext(playwright, authToken);

    try {
      await use(apiContext);
    } finally {
      await apiContext.dispose();
    }

  },

});

export { expect };
