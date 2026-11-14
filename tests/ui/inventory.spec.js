import { test, expect } from '../../fixtures/test.fixture.js';
import { products } from '../../test-data/products.js';

test.describe('Inventory Tests', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL(/inventory\.html/);
  });
  test('should display all products @smoke', async ({ inventoryPage }) => {
    const productsCount = await inventoryPage.getProductsCount();
    expect(productsCount).toBe(products.length);
  });

  test('should add product to cart @smoke', async ({ inventoryPage }) => {
    const productName = products[0].name;
    await inventoryPage.addProductToCart(productName);
    const cartCount = await inventoryPage.getCartItemsCount();
    expect(cartCount).toBe(1);
  });

  test('should add multiple products to cart', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(products[0].name);
    await inventoryPage.addProductToCart(products[1].name);
    const cartCount = await inventoryPage.getCartItemsCount();
    expect(cartCount).toBe(2);
  });

  test('should navigate to cart page', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(products[0].name);
    await inventoryPage.goToCart();
    expect(inventoryPage.page.url()).toContain('cart');
  });

  test('should display product with correct information', async ({ inventoryPage }) => {
    const productName = products[0].name;
    const isVisible = await inventoryPage.isProductVisible(productName);
    expect(isVisible).toBeTruthy();
  });
});
