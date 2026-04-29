import { test as base } from '@playwright/test';

export interface CustomFixtures {
  testUser: {
    username: string;
    password: string;
  };
}

export const test = base.extend<CustomFixtures>({
  testUser: async ({}, use) => {
    // Test user credentials
    await use({
      username: 'test_user',
      password: 'test_password123',
    });
  },
});

export { expect } from '@playwright/test';
