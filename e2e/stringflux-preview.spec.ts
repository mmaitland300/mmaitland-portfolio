import { test, expect } from "@playwright/test";

test("screenshot dialog contains keyboard focus and restores it after dismissal", async ({ page }) => {
  await page.goto("/stringflux");
  const opener = page.getByRole("button", { name: /Open StringFlux Core layout screenshot/ });
  await opener.focus();
  await opener.press("Enter");

  const dialog = page.getByRole("dialog", { name: /StringFlux Core layout full resolution preview/ });
  const close = dialog.getByRole("button", { name: "Close full resolution preview" });
  const screenshot = dialog.getByRole("region", { name: "Scrollable full resolution screenshot" });
  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(screenshot).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(screenshot).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();

  await opener.press("Enter");
  await close.click();
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test("full-resolution screenshot is scrollable on mobile and backdrop dismisses it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/stringflux");
  await page.getByRole("button", { name: "Advanced", exact: true }).click();
  const opener = page.getByRole("button", { name: /Open StringFlux Advanced layout screenshot/ });
  await opener.click();

  const dialog = page.getByRole("dialog");
  const screenshot = dialog.getByRole("region", { name: "Scrollable full resolution screenshot" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close full resolution preview" })).toBeInViewport();
  await screenshot.focus();
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => screenshot.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

  await page.mouse.click(2, 2);
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});
