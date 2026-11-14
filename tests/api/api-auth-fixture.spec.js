
import { test, expect } from '../../fixtures/api.fixture.js';

test.describe('API Fixture Tests', () => {

  test('should fetch products using reusable API fixture', async ({ apiRequest }) => {

    const response = await apiRequest.get('/products');

    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data.products.length).toBeGreaterThan(0);

  });

  test('should access user profile using authenticated fixture', async ({ authenticatedRequest }) => {

    const response = await authenticatedRequest.get('/auth/me');

    expect(response.status()).toBe(200);

    const profile = await response.json();

    expect(profile.username).toBe('emilys');

    console.log('Authenticated user:', profile.username);

  });

});
