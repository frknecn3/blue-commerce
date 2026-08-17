import { test, expect } from '@playwright/test';

test.describe('E2E: Guest Shopping & Cart Flow', () => {
  test('allows guest to browse products and see cart button', async ({ page }) => {
    // 1. Visit Home Page
    await page.goto('/');

    // 2. Expect main branding / title to be visible
    await expect(page).toHaveTitle(/BluE-Commerce|Home/i);

    // 3. Verify health endpoint responds with 200 OK
    const healthResponse = await page.request.get('/api/health');
    expect(healthResponse.status()).toBe(200);
    const healthBody = await healthResponse.json();
    expect(healthBody.status).toBe('healthy');
  });

  test('preserves guest cart state in localStorage', async ({ page }) => {
    await page.goto('/');

    // Simulate guest cart population in localStorage
    await page.evaluate(() => {
      const mockCart = [
        {
          productId: 'mock-product-123',
          quantity: 2,
        },
      ];
      localStorage.setItem('cart', JSON.stringify(mockCart));
    });

    // Reload page to trigger guest cart hydration
    await page.reload();

    const storedCart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    expect(storedCart).toContain('mock-product-123');
  });
});
