
import { test, expect } from '../../fixtures/api.fixture.js';

import {
  validateApiResponse,
  validateResponseTime,
  validateUnauthorizedResponse,
} from '../../utils/api-helpers.js';

test.describe('Reusable API Validation Tests', () => {

  test('should validate successful API response', async ({ apiRequest }) => {

    const startTime = Date.now();

    const response = await apiRequest.get('/products');

    const responseTime = Date.now() - startTime;

    const data = await validateApiResponse(response, 200);

    await validateResponseTime(responseTime);

    expect(data.products.length).toBeGreaterThan(0);

    console.log('Response time:', responseTime, 'ms');

  });

  test('should validate unauthorized API response', async ({ apiRequest }) => {

    const response = await apiRequest.get('/auth/me');

    const error = await validateUnauthorizedResponse(response);

    console.log('Unauthorized error:', error.message);

  });

});
