
import { BasePage } from './BasePage.js';

export class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);

    this.firstNameInput = '#first-name';
    this.lastNameInput = '#last-name';
    this.postalCodeInput = '#postal-code';

    this.continueButton = '#continue';
    this.finishButton = '#finish';
    this.cancelButton = '#cancel';

    this.errorMessage = '[data-test="error"]';
    this.orderConfirmation = '.complete-header';
  }

  async goto() {
    await this.page.goto('/checkout-step-one.html');
  }

  async fillCheckoutInfo(firstName, lastName, postalCode) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  async clickContinue() {
    await this.click(this.continueButton);
  }

  async clickFinish() {
    await this.click(this.finishButton);
  }

  async completeCheckout(firstName, lastName, postalCode) {
    await this.fillCheckoutInfo(firstName, lastName, postalCode);

    await this.clickContinue();

    await this.page.waitForURL('**/checkout-step-two.html', {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });

    // Wait for checkout overview
    await this.page.locator('#finish').waitFor({
      state: 'visible',
    });

    await this.clickFinish();

    await this.page.waitForURL('**/checkout-complete.html', {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });
  }

  async getOrderConfirmationMessage() {
    return await this.getText(this.orderConfirmation);
  }

  async isOrderConfirmationVisible() {
    return await this.page.locator(this.orderConfirmation).isVisible();
  }

  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  async isErrorMessageVisible() {
    return await this.page.locator(this.errorMessage).isVisible();
  }

  async cancelCheckout() {
    await this.click(this.cancelButton);

    await this.page.waitForURL('**/cart.html', {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });
  }
}
