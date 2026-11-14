export function getConfig() {
  const env = process.env.ENVIRONMENT || 'dev';

  const config = {
    dev: {
      baseURL: 'https://www.saucedemo.com',
      apiURL: 'https://dummyjson.com',
      timeout: 30000,
      navigationTimeout: 30000,
    },

    staging: {
      baseURL: process.env.STAGING_BASE_URL || 'https://www.saucedemo.com',
      apiURL: process.env.STAGING_API_URL || 'https://dummyjson.com',
      timeout: 30000,
      navigationTimeout: 30000,
    },

    production: {
      baseURL: process.env.PRODUCTION_BASE_URL || 'https://www.saucedemo.com',
      apiURL: process.env.PRODUCTION_API_URL || 'https://dummyjson.com',
      timeout: 30000,
      navigationTimeout: 30000,
    },
  };

  return config[env] || config.dev;
}

export const TEST_TIMEOUT = 30000;
export const NAVIGATION_TIMEOUT = 30000;
