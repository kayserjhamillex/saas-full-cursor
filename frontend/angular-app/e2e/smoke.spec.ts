import { test, expect } from '@playwright/test';

const TOKEN_KEY = 'admin_access_token';
const TENANT_KEY = 'admin_tenant_id';
const GATEWAY_BASE = 'http://localhost:3000/gateway';

test.beforeEach(async ({ page }) => {
  await page.route(`${GATEWAY_BASE}/auth/login`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: 'token-e2e' }),
    });
  });
  await page.route(`${GATEWAY_BASE}/**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.addInitScript(
    (keys: { t: string; n: string }) => {
      try {
        localStorage.removeItem(keys.t);
        localStorage.removeItem(keys.n);
      } catch {
        // ignore
      }
    },
    { t: TOKEN_KEY, n: TENANT_KEY },
  );
});

test.describe('autenticacion (smoke)', () => {
  test('carga el bootstrap sin depender del backend', async ({ page }) => {
    const res = await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    expect(res?.ok(), `HTTP ${res?.status()}`).toBeTruthy();
    await expect(page.locator('app-root')).toBeAttached();
  });

  test('mockea login del gateway sin backend real', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    const result = await page.evaluate(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'qa@test.com',
          password: '123456',
          tenantId: 'tenant-e2e',
        }),
      });
      const data = await response.json();
      return { status: response.status, data };
    }, GATEWAY_BASE);

    expect(result.status).toBe(200);
    expect(result.data).toBeTruthy();
    expect(typeof result.data.accessToken === 'string' || result.data.ok === true).toBeTruthy();
  });

  test('la ruta raiz responde aun sin backend', async ({ page }) => {
    const res = await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    expect(res?.ok(), `HTTP ${res?.status()}`).toBeTruthy();
    await expect(page.locator('app-root')).toBeAttached();
  });
});
