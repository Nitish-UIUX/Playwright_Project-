
export const apiCredentials = {
  username: 'emilys',
  password: 'emilyspass',
};

export const productTestData = {
  newProduct: {
    title: 'Playwright Automation Product',
    price: 199,
    category: 'electronics',
  },

  updatedProduct: {
    title: 'Updated Playwright Product',
    price: 15.99,
    description: 'Product updated using Playwright API testing',
  },
};

export const apiEndpoints = {
  products: '/products',
  singleProduct: '/products/1',
  addProduct: '/products/add',
  updateProduct: '/products/1',
  deleteProduct: '/products/1',
  login: '/auth/login',
  profile: '/auth/me',
};
