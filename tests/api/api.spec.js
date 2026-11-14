
import { test, expect } from '@playwright/test';
import apiClient from '../../utils/api-client.js';
import { apiUser } from '../../test-data/users.js';

test.describe('Axios API Tests', () => {

  // 1. GET - Fetch all products
  test('should fetch products from API', async () => {

    const response = await apiClient.get('/products');

    expect(response).toBeDefined();
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.products.length).toBeGreaterThan(0);
    expect(response.total).toBeGreaterThan(0);

  });


  // 2. GET - Fetch product by ID
  test('should get product by ID', async () => {

    const product = await apiClient.get('/products/1');

    expect(product).toBeDefined();
    expect(product.id).toBe(1);
    expect(product.title).toBeDefined();
    expect(product.price).toBeGreaterThan(0);

  });


  // 3. POST - Login via Axios
  test('should login via API', async () => {

    const response = await apiClient.post('/auth/login', {
      username: apiUser.username,
      password: apiUser.password,
    });

    expect(response).toBeDefined();
    expect(response.accessToken).toBeDefined();
    expect(response.username).toBe(apiUser.username);

  });


  // 4. GET - Handle API errors
  test('should handle API errors gracefully', async () => {

    let apiError;

    try {
      await apiClient.get('/products/invalid');
    } catch (error) {
      apiError = error;
    }
    expect(apiError).toBeDefined();
    expect(apiError.response?.status).toBe(404);
  });

  // 5. GET - Authenticate and fetch user profile
  test('should authenticate and fetch user profile', async () => {

    const loginResponse = await apiClient.post('/auth/login', {
      username: apiUser.username,
      password: apiUser.password,
    });

    expect(loginResponse.accessToken).toBeDefined();

    const userProfile = await apiClient.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${loginResponse.accessToken}`,
      },
    });

    expect(userProfile).toBeDefined();
    expect(userProfile.username).toBe(apiUser.username);

  });


  // 6. POST - Create cart with products
  test('should create a new cart with products', async () => {

    const cart = await apiClient.post('/carts/add', {
      userId: 1,
      products: [
        {
          id: 1,
          quantity: 2,
        },
      ],
    });

    expect(cart).toBeDefined();
    expect(cart.id).toBeDefined();
    expect(cart.userId).toBe(1);
    expect(cart.products).toHaveLength(1);
    expect(cart.products[0].quantity).toBe(2);

  });

});
