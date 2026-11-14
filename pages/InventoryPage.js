
import { BasePage } from './BasePage.js';

export class InventoryPage extends BasePage {
  constructor(page) {
    super(page);

    // Locators
    this.productsList = '.inventory_list';
    this.productItem = '.inventory_item';
    this.productName = '.inventory_item_name';
    this.addToCartButton = 'button.btn_inventory';
    this.cartIcon = '.shopping_cart_link';
    this.cartBadge = '.shopping_cart_badge';
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async getProductsCount() {
    // Wait until the inventory list is visible 
    await this.page.locator(this.productsList).waitFor({ 
      state: 'visible',
      timeout: 15000,
    });

    // Wait until at least one product is bisible
    await this.page.locator(this.productItem).first().waitFor({
      state: 'visible',
      timeout: 15000,
    });

    return await this.page.locator(this.productItem).count();
  }

  async addProductToCart(productName) {
    const product = this.page
      .locator(this.productItem)
      .filter({ hasText: productName });

    await product.locator(this.addToCartButton).click();
  }

  async goToCart() {
    await this.click(this.cartIcon);
    await this.page.waitForURL('**/cart.html');
  }

  async getCartItemsCount() {
    const badge = this.page.locator(this.cartBadge);

    if (!(await badge.isVisible())) {
      return 0;
    }

    const text = await badge.textContent();
    return Number(text) || 0;
  }

  async isProductVisible(productName) {
    const product = this.page
      .locator(this.productItem)
      .filter({ hasText: productName });

    await product.waitFor({
      state: 'visible',
      timeout: 10000,
    });

    return true;
  }

  async getProductNames() {
    return await this.page.locator(this.productName).allTextContents();
  }
}
