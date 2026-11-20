
import { test, expect } from '../../fixtures/api.fixture.js';
import { apiUser } from '../../test-data/users.js';

test.describe('Playwright API Testing', () => {

  // 1. GET - Fetch all products
  test('should fetch products using APIRequestContext', async ({ apiRequest }) => {

    const response = await apiRequest.get('/products');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    expect(responseBody.products).toBeDefined();
    expect(Array.isArray(responseBody.products)).toBeTruthy();
    expect(responseBody.products.length).toBeGreaterThan(0);
    expect(responseBody.total).toBeGreaterThan(0);
    expect(response.status()).toBe(999);

    console.log('Total products:', responseBody.total);
    console.log('First product:', responseBody.products[0].title);

  });


  // 2. GET - Fetch a single product
  test('should fetch a single product by ID', async ({ apiRequest }) => {

    const response = await apiRequest.get('/products/1');

    expect(response.status()).toBe(200);

    const product = await response.json();

    expect(product.id).toBe(1);
    expect(product.title).toBeDefined();
    expect(product.price).toBeGreaterThan(0);
    expect(product.category).toBeDefined();

    console.log('Product ID:', product.id);
    console.log('Product Name:', product.title);
    console.log('Product Price:', product.price);

  });


  // 3. POST - Create a product
  test('should create a product using POST request', async ({ apiRequest }) => {

    const newProduct = {
      title: 'Playwright Automation Product',
      price: 199,
      category: 'electronics',
    };

    const response = await apiRequest.post('/products/add', {
      data: newProduct,
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.id).toBeDefined();
    expect(responseBody.title).toBe(newProduct.title);
    expect(responseBody.price).toBe(newProduct.price);

    console.log('Created Product ID:', responseBody.id);
    console.log('Created Product:', responseBody.title);

  });


  // 4. PUT - Update a product
  test('should update a product using PUT request', async ({ apiRequest }) => {

    const updatedProduct = {
      title: 'Updated Playwright Product',
      price: 15.99,
      description: 'Product updated using Playwright API testing',
    };

    const response = await apiRequest.put('/products/1', {
      data: updatedProduct,
    });

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    expect(responseBody.id).toBe(1);
    expect(responseBody.title).toBe(updatedProduct.title);
    expect(responseBody.price).toBe(updatedProduct.price);
    expect(responseBody.description).toBe(updatedProduct.description);

    console.log('Updated Product ID:', responseBody.id);
    console.log('Updated Product:', responseBody.title);
    console.log('Updated Price:', responseBody.price);

  });


  // 5. DELETE - Delete a product
  test('should delete a product using DELETE request', async ({ apiRequest }) => {

    const response = await apiRequest.delete('/products/1');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    expect(responseBody.id).toBe(1);
    expect(responseBody.isDeleted).toBeTruthy();
    expect(responseBody.deletedOn).toBeDefined();

    console.log('Deleted Product ID:', responseBody.id);
    console.log('Is Deleted:', responseBody.isDeleted);
    console.log('Deleted On:', responseBody.deletedOn);

  });


  // 6. POST - Login and retrieve access token
  test('should login and retrieve access token', async ({ apiRequest }) => {

    const response = await apiRequest.post('/auth/login', {
      data: {
        username: apiUser.username,
        password: apiUser.password,
      },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.accessToken).toBeDefined();
    expect(responseBody.username).toBe(apiUser.username);

    console.log('Username:', responseBody.username);
    console.log('Access token received:', Boolean(responseBody.accessToken));

  });


  // 7. GET - Fetch authenticated user profile
  test('should fetch user profile using access token', async ({ authenticatedRequest }) => {

    const response = await authenticatedRequest.get('/auth/me');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const profile = await response.json();

    expect(profile.username).toBe(apiUser.username);
    expect(profile.id).toBeDefined();
    expect(profile.email).toBeDefined();

    console.log('Authenticated User:', profile.username);
    console.log('User Email:', profile.email);
    console.log('User ID:', profile.id);

  });


  // 8. GET - Reject request without authentication
  test('should reject request without authentication', async ({ apiRequest }) => {

    const response = await apiRequest.get('/auth/me');

    expect(response.status()).toBe(401);
    expect(response.ok()).toBeFalsy();

    const responseBody = await response.json();

    expect(responseBody.message).toBeDefined();

    console.log('Unauthorized Status:', response.status());
    console.log('Error Response:', responseBody);

  });


  // 9. Validate response headers and response time
  test('should validate API response headers and response time', async ({ apiRequest }) => {

    const startTime = Date.now();

    const response = await apiRequest.get('/products');

    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);

    const headers = response.headers();

    expect(headers['content-type']).toContain('application/json');
    expect(responseTime).toBeLessThan(5000);

    console.log('Response Status:', response.status());
    console.log('Content Type:', headers['content-type']);
    console.log('Response Time:', responseTime, 'ms');

  });

});
