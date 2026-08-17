import { test, expect } from '@playwright/test';

test.describe('E2E: Admin Route Security Guards', () => {
  test('redirects unauthenticated users away from /admin', async ({ page }) => {
    // Attempt to access protected admin route as unauthenticated guest
    await page.goto('/admin');

    // Next.js middleware / NextAuth redirects unauthorized users to home or login
    await page.waitForURL((url) => {
      return url.pathname === '/' || url.pathname.includes('/login') || url.pathname.includes('/api/auth/signin');
    });

    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).not.toBe('/admin');
  });

  test('blocks unauthorized access to /admin/product sub-route', async ({ page }) => {
    await page.goto('/admin/product');

    await page.waitForURL((url) => {
      return url.pathname === '/' || url.pathname.includes('/login') || url.pathname.includes('/api/auth/signin');
    });

    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).not.toBe('/admin/product');
  });
});
