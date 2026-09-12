import { test, expect } from "@playwright/test";

test("waitlist form rejects malformed server payload", async ({ page }) => {
  await page.goto("/stringflux");
  const submitButton = page.locator('button[type="submit"]');
  await expect(submitButton).toBeVisible();

  await page.fill('input[name="email"]', "tester@example.com");
  await page.fill('input[name="interest"]', "Live performance");
  await page.evaluate(() => {
    const hp = document.querySelector('input[name="_hp"]') as HTMLInputElement | null;
    if (hp) hp.value = "bot-signal";
  });
  await submitButton.click();

  await expect(page.getByText("Please fix the errors below.")).toBeVisible({
    timeout: 10_000,
  });
  await expect(submitButton).toBeVisible();
  await expect(page.locator("form").getByRole("alert")).toBeFocused();
  await expect(page.locator('input[name="email"]')).toHaveValue("tester@example.com");
  await expect(page.locator('input[name="interest"]')).toHaveValue("Live performance");
});

test("waitlist links field validation errors and keeps the draft", async ({ page }) => {
  await page.goto("/stringflux");
  const email = page.locator('input[name="email"]');
  // Disable native validation to exercise the server's email error and focus path.
  await page.locator("form").evaluate((form) => { (form as HTMLFormElement).noValidate = true; });
  await email.fill("invalid-email");
  await page.fill('input[name="interest"]', "Studio textures");
  await page.locator('button[type="submit"]').click();
  await expect(page.locator("#wl-email-error")).toHaveText("Invalid email address");
  await expect(email).toHaveValue("invalid-email");
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAttribute("aria-describedby", "wl-consent wl-email-error");
  await expect(email).toBeFocused();
  await expect(page.locator('input[name="interest"]')).toHaveValue("Studio textures");
});
