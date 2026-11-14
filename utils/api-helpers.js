
import { expect } from '@playwright/test';

export async function validateApiResponse(response, expectedStatus) {

  expect(response.status()).toBe(expectedStatus);

  expect(response.headers()['content-type'])
    .toContain('application/json');

  return await response.json();
}

export async function validateResponseTime(
  responseTime,
  maxTime = 5000
) {
  expect(responseTime).toBeLessThan(maxTime);
}

export async function validateUnauthorizedResponse(response) {

  expect(response.status()).toBe(401);

  const responseBody = await response.json();

  expect(responseBody.message).toBeDefined();

  return responseBody;
}
