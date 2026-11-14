# Playwright Test Framework

This is a comprehensive Playwright test automation framework built with the **Page Object Model (POM)** pattern.

## Project Structure

```
├── tests/                    # Test specifications
│   ├── auth.spec.js         # Authentication tests
│   ├── inventory.spec.js    # Inventory/products tests
│   ├── checkout.spec.js     # Checkout flow tests
│   └── api.spec.js          # API tests
├── pages/                    # Page Object Model classes
│   ├── BasePage.js          # Base class with common methods
│   ├── LoginPage.js         # Login page object
│   ├── InventoryPage.js     # Inventory page object
│   ├── CartPage.js          # Cart page object
│   └── CheckoutPage.js      # Checkout page object
├── fixtures/                 # Reusable test fixtures
│   └── test.fixture.js      # Custom fixtures and page objects
├── test-data/               # Test data and fixtures
│   ├── users.js             # User test data
│   └── products.js          # Product test data
├── utils/                    # Utility functions
│   ├── api-client.js        # API client wrapper
│   └── helpers.js           # Helper functions
├── config/                   # Configuration files
│   └── environment.js       # Environment configuration
├── reports/                  # Test reports
├── playwright.config.js      # Playwright configuration
├── package.json             # Project dependencies
└── .gitignore              # Git ignore rules
```

## Installation

1. **Install dependencies:**
```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (browser visible)
```bash
npm run test:headed
```

### Run specific test file
```bash
npm run test:auth
npm run test:inventory
npm run test:checkout
npm run test:api
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI mode
```bash
npm run test:ui
```

### View test report
```bash
npm run report
```

## Configuration

### Environment Variables

Update the `config/environment.js` file to configure different environments:

- **dev**: Development environment (default)
- **staging**: Staging environment
- **production**: Production environment

Set environment:
```bash
ENVIRONMENT=staging npm test
```

## Page Objects

### BasePage
Base class containing common page methods:
- `goto(url)` - Navigate to URL
- `click(selector)` - Click element
- `fill(selector, text)` - Fill input field
- `getText(selector)` - Get element text
- `isVisible(selector)` - Check if element is visible
- `waitForElement(selector)` - Wait for element
- `takeScreenshot(filename)` - Take screenshot

### LoginPage
Handles login functionality:
- `login(username, password)` - Login with credentials
- `getErrorMessage()` - Get error message
- `isErrorMessageVisible()` - Check error visibility

### InventoryPage
Handles product inventory:
- `getProductsCount()` - Get number of products
- `addProductToCart(productName)` - Add product to cart
- `goToCart()` - Navigate to cart
- `getCartItemsCount()` - Get cart items count
- `isProductVisible(productName)` - Check product visibility

### CartPage
Handles shopping cart:
- `getCartItemsCount()` - Get number of items
- `getTotalPrice()` - Get total price
- `proceedToCheckout()` - Go to checkout
- `removeItemFromCart(productName)` - Remove item

### CheckoutPage
Handles checkout process:
- `fillCheckoutInfo(firstName, lastName, postalCode)` - Fill checkout form
- `completeCheckout(...)` - Complete checkout
- `getOrderConfirmationMessage()` - Get confirmation
- `cancelCheckout()` - Cancel checkout

## Test Data

### Users (`test-data/users.js`)
- Standard user with valid credentials
- Locked out user
- Problem user
- Invalid user credentials for negative tests

### Products (`test-data/products.js`)
- 6 sample products with pricing
- Helper functions to find products by name or ID

## Fixtures

### Custom Test Fixture (`fixtures/test.fixture.js`)
Provides all page objects to tests:
```javascript
test('my test', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
  // Use page objects
});
```

### Authenticated Fixture
Pre-logs in user before test:
```javascript
test('authenticated test', async ({ authenticatedPage }) => {
  const { page } = authenticatedPage;
  // User is already logged in
});
```

## Utilities

### API Client (`utils/api-client.js`)
HTTP client for API testing:
```javascript
import apiClient from '../utils/api-client.js';

const products = await apiClient.get('/products');
await apiClient.post('/cart', { userId: 1 });
apiClient.setAuthToken(token);
```

### Helpers (`utils/helpers.js`)
- `wait(ms)` - Wait for milliseconds
- `generateRandomString(length)` - Generate random string
- `generateRandomEmail()` - Generate random email
- `retry(fn, maxAttempts, delay)` - Retry with backoff
- `formatDate(date)` - Format date
- And more...

## Best Practices

1. **Use Page Objects** - Always use page object classes for UI interactions
2. **Keep Tests Focused** - Each test should verify one specific behavior
3. **Use Test Data** - Centralize test data in `test-data/` folder
4. **Leverage Fixtures** - Use custom fixtures for reusable test setup
5. **Handle Waits** - Use built-in Playwright waits, avoid hard sleeps
6. **Meaningful Assertions** - Write clear, readable assertions
7. **Screenshot on Failure** - Automatically captured via config

## Reports

Test reports are generated in the `reports/` folder:
- **html/** - HTML report with detailed results
- **results.json** - JSON format test results
- **results.xml** - JUnit XML format (CI/CD integration)

## CI/CD Integration

Configure in your CI/CD pipeline:
```bash
npm install
npm test
```

Reports will be available in the `reports/` directory.

## Debugging

### Debug Mode
```bash
npm run test:debug
```

### UI Mode
```bash
npm run test:ui
```

### View Traces
Traces are automatically saved for failed tests and can be viewed:
```bash
npx playwright show-trace reports/trace.zip
```

## Troubleshooting

- **Port already in use**: Update `baseURL` in `config/environment.js`
- **Element not found**: Check selectors and wait times
- **Test timeout**: Increase timeout in `playwright.config.js`
- **Authentication issues**: Verify credentials in `test-data/users.js`

## Contributing

When adding new tests:
1. Create new page object in `pages/`
2. Add test data to `test-data/`
3. Write tests in `tests/`
4. Follow naming conventions
5. Update this README

## License

ISC
