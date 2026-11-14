export const validUsers = [
  {
    username: 'standard_user',
    password: 'secret_sauce',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  },
  {
    username: 'locked_out_user',
    password: 'secret_sauce',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
  },
  {
    username: 'problem_user',
    password: 'secret_sauce',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
  },
];

export const apiUser = {
  username: 'emilys',
  password: 'emilyspass'
}

export const invalidUsers = [
  {
    username: 'invalid_user',
    password: 'wrong_password',
  },
  {
    username: '',
    password: 'password123',
  },
  {
    username: 'user@example.com',
    password: '',
  },
];

export const testUser = validUsers[0];
