
import { test, expect } from '../../fixtures/test.fixture.js';
import { testUser } from '../../test-data/users.js';
import { products } from '../../test-data/products.js';

test.describe('Checkout Tests', () => {

  // Prepare cart before every test
  test.beforeEach(async ({ authenticatedPage, inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart(products[0].name);
    await inventoryPage.goToCart();
    await cartPage.waitForCartPage();
  });

  // Test 1: Complete checkout successfully
  test('should complete checkout successfully', async ({
    cartPage,
    checkoutPage,
  }) => {
    await cartPage.proceedToCheckout();

    await checkoutPage.completeCheckout(
      testUser.firstName,
      testUser.lastName,
      '12345'
    );

    await expect(
      checkoutPage.page.locator('.complete-header')
    ).toBeVisible();
  });

  // Test 2: Display error for incomplete checkout information
  test('should display error when checkout info is incomplete', async ({
    cartPage,
    checkoutPage,
  }) => {
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCheckoutInfo('', '', '');
    await checkoutPage.clickContinue();

    await expect(
      checkoutPage.page.locator('[data-test="error"]')
    ).toBeVisible();

    await expect(
      checkoutPage.page.locator('[data-test="error"]')
    ).toContainText('First Name is required');
  });

  // Test 3: Cancel checkout and return to inventory
  test('should cancel checkout and return to cart', async ({
    cartPage,
    checkoutPage,
  }) => {
    await cartPage.proceedToCheckout();

    await checkoutPage.cancelCheckout();

    await expect(checkoutPage.page).toHaveURL(/cart\.html/);
  });

  // Test 4: Verify order confirmation message
  test('should display order confirmation message', async ({
    cartPage,
    checkoutPage,
  }) => {
    await cartPage.proceedToCheckout();

    await checkoutPage.completeCheckout(
      testUser.firstName,
      testUser.lastName,
      '12345'
    );

    const message = await checkoutPage.getOrderConfirmationMessage();

    expect(message).toContain('Thank you');
  });

  // Test 5: Calculate item subtotal correctly
  test('should calculate total price correctly', async ({
    cartPage,
  }) => {
    const totalPrice = await cartPage.getTotalPrice();

    expect(totalPrice).toBe(products[0].price);
  });

});
