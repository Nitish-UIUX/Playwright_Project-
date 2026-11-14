
import { BasePage } from './BasePage.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);

    this.cartItems = '.cart_item';
    this.cartItemPrice = '.inventory_item_price';
    this.cartItemQuantity = '.cart_quantity';
    this.totalPrice = '.summary_subtotal_label';

    this.checkoutButton = '#checkout';
    this.continueShopping = '#continue-shopping';
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async waitForCartPage() {
    await this.page.waitForURL('**/cart.html');
    await this.page.locator('.cart_list').waitFor({
      state: 'visible',
    });
  }

  async getCartItemsCount() {
    return await this.page.locator(this.cartItems).count();
  }

  async getCartItemByName(productName) {
    return this.page
      .locator(this.cartItems)
      .filter({ hasText: productName });
  }

  async getTotalPrice() {
    const priceElements = this.page.locator(this.cartItemPrice);

    await priceElements.first().waitFor({
      state: 'visible',
    });

    const prices = await priceElements.allTextContents();

    return prices.reduce((total, price) => {
      return total + parseFloat(price.replace('$', '').trim());
    }, 0);
  }

  async proceedToCheckout() {
    await this.click(this.checkoutButton);
    await this.page.waitForURL('**/checkout-step-one.html');
  }

  async continueShopping() {
    await this.click(this.continueShopping);
    await this.page.waitForURL('**/inventory.html');
  }

  async removeItemFromCart(productName) {
    const item = await this.getCartItemByName(productName);
    await item.locator('button.cart_button').click();
  }
}
