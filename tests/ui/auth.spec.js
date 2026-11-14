import { test, expect } from '../../fixtures/test.fixture.js';
import { validUsers, invalidUsers } from '../../test-data/users.js';

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ loginPage }) => {
    await loginPage.login(validUsers[0].username, validUsers[0].password);
    await expect(loginPage.page).toHaveURL(/inventory\.html/);
  });

  test('should display error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(invalidUsers[0].username, invalidUsers[0].password);
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('should display error when username is empty', async ({ loginPage }) => {
    await loginPage.login('', validUsers[0].password);
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('should display error when password is empty', async ({ loginPage }) => {
    await loginPage.login(validUsers[0].username, '');
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
  });

  test('should handle locked out user', async ({ loginPage }) => {
    await loginPage.login(validUsers[1].username, validUsers[1].password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
  });
});
