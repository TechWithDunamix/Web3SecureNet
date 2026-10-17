import { test, expect, type Page } from '@playwright/test';

const user = { id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User', date_joined: '2025-10-01', verified: false };
const address = '0x1111111111111111111111111111111111111111';

async function mockApi(page: Page) {
  await page.route('**/api/**', route => {
    const url = route.request().url();
    let data: unknown = {};
    if (url.includes('/auth/login')) data = { user, tokens: { access: 'mock-access', refresh: 'mock-refresh' } };
    if (url.includes('/profile/')) data = user;
    // Simulate a partial statistics response and nullable market values.
    if (url.includes('/profile/stats/')) data = { balance: '12.50' };
    if (url.includes('/wallet/status/')) data = { wallet_connected: false, wallet: null };
    if (url.includes('/transactions/')) data = { results: [] };
    if (url.includes('/coins/markets')) data = [null, { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: null, price_change_percentage_24h: null }];
    return route.fulfill({ json: data });
  });
}

async function login(page: Page) {
  await page.goto('/login');
  await page.getByPlaceholder('Enter your email').fill(user.email);
  await page.getByPlaceholder('Enter your password').fill('example-password');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
}

test('login survives missing statistics and nullable market numbers', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await mockApi(page);
  await login(page);
  await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
  await expect(page.getByText('Bitcoin', { exact: true }).first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText('This page could not be loaded');
  await expect(page.locator('body')).not.toContainText('NaN');
  await expect(page.locator('.Toastify')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('a malformed login response stays on the login page with a message', async ({ page }) => {
  await mockApi(page);
  await page.route('**/auth/login-alt/', route => route.fulfill({ json: { user } }));
  await login(page);
  await expect(page.getByText('The server returned an invalid login response. Please try again.')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
  expect(await page.evaluate(() => localStorage.getItem('access_token'))).toBeNull();
});

test('forgot password opens a page and submits an email request', async ({ page }) => {
  await mockApi(page);
  await page.route('**/auth/password-reset/', route => {
    expect(route.request().postDataJSON()).toEqual({ email: user.email });
    return route.fulfill({ json: { message: 'If an account exists for that email, a password reset link will be sent.' } });
  });
  await page.goto('/login');
  await page.getByRole('link', { name: 'Forgot password?' }).click();
  await expect(page.getByRole('heading', { name: 'Forgot password?' })).toBeVisible();
  await page.getByLabel('Email', { exact: true }).fill(user.email);
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await expect(page.getByRole('status')).toContainText('If an account exists');
});

test('unconfigured email service shows a visible error', async ({ page }) => {
  await mockApi(page);
  await page.route('**/auth/password-reset/', route => route.fulfill({ status: 503, json: { detail: 'Password recovery is temporarily unavailable. Please contact your administrator.' } }));
  await page.goto('/forgot-password');
  await page.getByLabel('Email', { exact: true }).fill(user.email);
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await expect(page.getByRole('alert')).toContainText('temporarily unavailable');
});

test('reset link validates confirmation and posts the token with the new password', async ({ page }) => {
  await mockApi(page);
  await page.route('**/auth/password-reset/confirm/', route => {
    expect(route.request().postDataJSON()).toEqual({ uid: 'MQ', token: 'test-token', password: 'new-test-password' });
    return route.fulfill({ json: { message: 'Password updated. You can now sign in.' } });
  });
  await page.goto('/reset-password/MQ/test-token');
  await page.getByLabel('New password', { exact: true }).fill('new-test-password');
  await page.getByLabel('Confirm password').fill('different-password');
  await page.getByRole('button', { name: 'Reset password' }).click();
  await expect(page.getByRole('alert')).toHaveText('Passwords do not match.');
  await page.getByLabel('Confirm password').fill('new-test-password');
  await page.getByRole('button', { name: 'Reset password' }).click();
  await expect(page.getByRole('status')).toContainText('Password updated');
});

test('wallet connection uses browser permission and submits only a public address', async ({ page }) => {
  await mockApi(page);
  await page.addInitScript(({ address }) => {
    Object.assign(window, { ethereum: { request: async ({ method }: { method: string }) => {
      if (method !== 'eth_requestAccounts') throw new Error('Unexpected wallet method');
      return [address];
    } } });
  }, { address });
  let saved = false;
  await page.route('**/wallet/connect/', route => {
    expect(route.request().postDataJSON()).toEqual({ wallet_name: 'Browser wallet', wallet_number: address });
    saved = true;
    return route.fulfill({ json: { user: { ...user, wallet_name: 'Browser wallet', wallet_number: address } } });
  });
  await login(page);
  await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
  await page.getByRole('button', { name: 'Connect Wallet', exact: true }).click();
  await expect(page.getByRole('dialog').locator('input, textarea')).toHaveCount(0);
  await page.getByRole('button', { name: 'Connect browser wallet', exact: true }).click();
  await expect(page.getByText('Wallet address saved successfully', { exact: true })).toBeVisible();
  expect(saved).toBe(true);
});

test('unknown routes render a recovery link instead of a blank screen', async ({ page }) => {
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to sign in' })).toBeVisible();
});


test('classroom wallet demo shows a warning and never sends wallet data', async ({ page }) => {
  await mockApi(page);
  const walletWrites: string[] = [];
  page.on('request', request => {
    if (request.url().includes('/wallet/') && request.method() !== 'GET') walletWrites.push(request.url());
  });
  await login(page);
  await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
  await page.getByRole('button', { name: 'Connect Wallet', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('Classroom training demo');
  await page.getByRole('button', { name: 'MetaMask Demo' }).click();
  await expect(page.getByRole('status')).toContainText('Simulating connection to MetaMask');
  await expect(page.getByRole('alert')).toContainText('Never share your recovery phrase or private key');
  await expect(page.getByLabel('Dummy recovery value', { exact: true })).toBeDisabled();
  await expect(page.getByLabel('Dummy recovery value', { exact: true })).toHaveValue('TRAINING DEMO - NOT A REAL RECOVERY PHRASE');
  expect(walletWrites).toEqual([]);
  await page.getByRole('button', { name: 'Try another demo wallet' }).click();
  await expect(page.getByRole('button', { name: 'MetaMask Demo' })).toBeVisible();
});

test('closing a simulated connection cancels it and resets the demonstration', async ({ page }) => {
  await mockApi(page);
  await login(page);
  await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
  await page.getByRole('button', { name: 'Connect Wallet', exact: true }).click();
  await page.getByRole('button', { name: 'MetaMask Demo' }).click();
  await page.getByRole('button', { name: 'Close wallet dialog' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Connect Wallet', exact: true }).click();
  await expect(page.getByRole('button', { name: 'MetaMask Demo' })).toBeVisible();
  await expect(page.getByLabel('Dummy recovery value', { exact: true })).toHaveCount(0);
});
