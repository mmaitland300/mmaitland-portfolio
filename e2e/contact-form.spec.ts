import { test, expect } from "@playwright/test";

test("contact form shows server validation on short message", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(page.locator('button[type="submit"]')).toBeVisible();

  await page.fill('input[name="name"]', "Test");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('textarea[name="message"]', "short");
  await page.click('button[type="submit"]');

  await expect(
    page.getByText("Message must be at least 10 characters")
  ).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('input[name="name"]')).toHaveValue("Test");
  await expect(page.locator('input[name="email"]')).toHaveValue("test@example.com");
  const message = page.locator('textarea[name="message"]');
  await expect(message).toHaveValue("short");
  await expect(message).toHaveAttribute("aria-invalid", "true");
  await expect(message).toHaveAttribute("aria-describedby", "contact-message-error");
  await expect(message).toBeFocused();
  await expect(page.locator("form").getByRole("alert")).toHaveText("Please fix the errors below.");

  // An identical repeated failure must still keep the draft and return focus.
  await page.locator('button[type="submit"]').click();
  await expect(message).toBeFocused();
  await expect(message).toHaveValue("short");
});

test("contact form renders required fields", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test("contact form rejects honeypot fill (bot signal)", async ({ page }) => {
  await page.goto("/contact");
  await page.fill('input[name="name"]', "Test");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill(
    'textarea[name="message"]',
    "This message is long enough for server validation."
  );
  await page.evaluate(() => {
    const hp = document.querySelector(
      'input[name="_hp"]'
    ) as HTMLInputElement | null;
    if (hp) hp.value = "bot-signal";
  });
  await page.locator('button[type="submit"]').click();

  await expect(page.getByText("Please fix the errors below.")).toBeVisible({
    timeout: 10_000,
  });
  await expect(page.locator("form").getByRole("alert")).toBeFocused();
  await expect(page.locator('input[name="name"]')).toHaveValue("Test");
  await expect(page.locator('input[name="email"]')).toHaveValue("test@example.com");
  await expect(page.locator('textarea[name="message"]')).toHaveValue(
    "This message is long enough for server validation."
  );
});

test("contact form valid submit reaches a terminal UI state", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.fill('input[name="name"]', "E2E Test");
  await page.fill('input[name="email"]', "e2e-test@example.com");
  await page.fill(
    'textarea[name="message"]',
    "Playwright trust-path check: valid payload long enough."
  );
  await page.locator('button[type="submit"]').click();

  await expect(
    page.getByText(
      /Message Sent!|Contact form is not configured yet|Failed to send your message|Too many requests|The contact form is temporarily unavailable/
    )
  ).toBeVisible({ timeout: 20_000 });
  if (await page.locator("form").getByRole("alert").isVisible()) {
    await expect(page.locator("form").getByRole("alert")).toBeFocused();
    await expect(page.locator('input[name="name"]')).toHaveValue("E2E Test");
    await expect(page.locator('input[name="email"]')).toHaveValue("e2e-test@example.com");
    await expect(page.locator('textarea[name="message"]')).toHaveValue(
      "Playwright trust-path check: valid payload long enough."
    );
  }
});
