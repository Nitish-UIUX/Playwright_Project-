export const products = [
  {
    id: 1,
    name: 'Sauce Labs Backpack',
    price: 29.99,
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds unstructured minimalism with innovative functionality.',
  },
  {
    id: 2,
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    description: 'A red light isn\'t the desired state in testing, but a red bike light is cool.',
  },
  {
    id: 3,
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt.',
  },
  {
    id: 4,
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    description: 'It\'s not a mess, it\'s a statement. The fritz jacket has a classic look and an unstable sort of charm.',
  },
  {
    id: 5,
    name: 'Sauce Labs Onesie',
    price: 7.99,
    description: 'Uh... not sure what the name is on this one, but I\'m taking it away from you. It\'s too good.',
  },
  {
    id: 6,
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate tests. Super-soft and comfy.',
  },
];

export const getProductByName = (name) => {
  return products.find(p => p.name === name);
};

export const getProductById = (id) => {
  return products.find(p => p.id === id);
};
