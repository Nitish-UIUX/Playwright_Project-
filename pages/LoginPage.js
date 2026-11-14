
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Locators
    this.usernameInput = '#user-name';
    this.passwordInput = '#password';
    this.loginButton = '#login-button';
    this.errorMessage = '[data-test="error"]';
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage() {
    return await this.getText(this.errorMessage);
  }

  async isErrorMessageVisible() {
    return await this.isVisible(this.errorMessage);
  }

  async verifyLoginSuccessful() {
    await this.page.waitForURL('**/inventory.html');
    return this.page.url().includes('/inventory.html');
  }

  async clearLoginForm() {
    await this.page.locator(this.usernameInput).clear();
    await this.page.locator(this.passwordInput).clear();
  }
}
